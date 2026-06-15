// Force DNS resolution order — must be set before any network connections
// Current Supabase project (db.kpbyogndzjptqcpmoaxw.supabase.co) only publishes
// an AAAA record (no A record), so we must try IPv6 first.
import dns from 'dns';
dns.setDefaultResultOrder('verbatim');

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

// Load env.gateway.json values into process.env (without overwriting existing vars)
import path from 'path';
import fs from 'fs';

const envGatewayPath = path.resolve(__dirname, '../../env/src/env.gateway.json');
try {
  const envGatewayContent = fs.readFileSync(envGatewayPath, 'utf-8');
  const envGatewayVars = JSON.parse(envGatewayContent);
  for (const [key, value] of Object.entries(envGatewayVars)) {
    if (!process.env[key] && value !== '' && value !== null && value !== undefined) {
      process.env[key] = String(value);
    }
  }
} catch {
  // env.gateway.json not found or invalid — rely on .env / system env vars
}

// Import Express app instance
import app from './app';

// Custom Winston logger
import { logger } from '@sprintpulse/config';

// Prisma client for database access
import { prisma } from '@sprintpulse/database';

// Server configuration
const PORT = parseInt(process.env.PORT || '3600', 10);
const HOST = process.env.HOST || '0.0.0.0';

/**
 * --------------------------------
 * Database Connection Check
 * --------------------------------
 * Ensures database is reachable
 * before starting the server
 */
async function checkDatabaseConnection() {
  try {
    const db = await prisma;
    await db.$queryRaw`SELECT 1`;
    logger.info('Database connection established');
  } catch (error) {
    // Don't kill the server on DB failure — surface the error and keep listening.
    // Individual requests will fail with a clear DB error instead of a generic 404.
    logger.error('Failed to connect to database (server will still start):', error);
  }
}

// Nav feature flags that gate consultant sidebar items
const NAV_FLAGS = [
  {
    key: 'nav_people_management',
    name: 'People Management Nav',
    description: 'Controls visibility of People Management in the consultant navigation',
  },
  {
    key: 'nav_analytics',
    name: 'Analytics Nav',
    description: 'Controls visibility of Analytics in the consultant navigation',
  },
] as const;

async function seedNavFlags() {
  try {
    const db = await prisma;
    for (const flag of NAV_FLAGS) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (db as any).featureFlag.upsert({
        where: { key: flag.key },
        update: {},
        create: {
          name: flag.name,
          key: flag.key,
          description: flag.description,
          environment: 'Production',
          status: 'Disabled',
          roles: JSON.stringify(['Admin', 'Consultant']),
        },
      });
    }
    logger.info('Nav feature flags seeded');
  } catch (error) {
    logger.error('Failed to seed nav feature flags:', error);
  }
}

/**
 * --------------------------------
 * Server Startup
 * --------------------------------
 */
async function startServer() {
  try {
    // Verify database connectivity
    await checkDatabaseConnection();

    // Ensure nav-gating feature flags exist in DB
    await seedNavFlags();

    // Start HTTP server
    const server = app.listen(PORT, HOST, () => {
      logger.info('='.repeat(60));
      logger.info(`SprintPulse Backend API Server Started`);
      logger.info('='.repeat(60));
      logger.info(`Server running on: http://${HOST}:${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
      logger.info('='.repeat(60));
    });

    /**
     * --------------------------------
     * Graceful Shutdown Handler
     * --------------------------------
     * Ensures server and DB close cleanly
     */
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} signal received: initiating graceful shutdown`);

      // Stop accepting new HTTP requests
      server.close(async () => {
        logger.info('HTTP server closed');

        try {
          // Close Prisma DB connection
          const db = await prisma;
          await db.$disconnect();
          logger.info('Database connection closed');
          logger.info('Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    // Handle OS-level shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Catch uncaught synchronous errors
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    // Catch unhandled promise rejections
    process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('unhandledRejection');
    });

    return server;
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Bootstrap the application
startServer().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
