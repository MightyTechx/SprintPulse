import { PrismaClient } from '../../../gateways/src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dns from 'dns';
import path from 'path';
import fs from 'fs';

// DNS resolution order: try the addresses in whatever order the OS returns them.
// The current Supabase project (db.kpbyogndzjptqcpmoaxw.supabase.co) only publishes
// an IPv6 (AAAA) record, so we must allow IPv6 to be used.
dns.setDefaultResultOrder('verbatim');

function resolveHost(host: string): Promise<string> {
  return new Promise((resolve, reject) => {
    dns.lookup(host, { all: true }, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        reject(err ?? new Error(`No DNS records for ${host}`));
        return;
      }
      resolve(addresses[0].address);
    });
  });
}

function parseDbUrl(raw: string) {
  const u = new URL(raw);
  return {
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    host: u.hostname,
    port: parseInt(u.port, 10) || 5432,
    database: u.pathname.replace(/^\//, ''),
  };
}

// Get project root (where .env is located)
function getProjectRoot(): string {
  // Start from the current working directory
  return process.cwd();
}

// Load env vars from both .env and env.gateway.json
function loadEnvVars() {
  const root = getProjectRoot();

  // Load from .env first
  try {
    const envPath = path.resolve(root, '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      envContent.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const eqIndex = trimmed.indexOf('=');
          if (eqIndex > 0) {
            const key = trimmed.substring(0, eqIndex).trim();
            const value = trimmed.substring(eqIndex + 1).trim();
            if (!process.env[key]) {
              process.env[key] = value;
            }
          }
        }
      });
    }
  } catch {
    // .env not found
  }

  // Load from env.gateway.json (without overwriting existing vars)
  try {
    const envGatewayPath = path.resolve(root, 'env/src/env.gateway.json');
    if (fs.existsSync(envGatewayPath)) {
      const envGatewayContent = fs.readFileSync(envGatewayPath, 'utf-8');
      const envGatewayVars = JSON.parse(envGatewayContent);
      for (const [key, value] of Object.entries(envGatewayVars)) {
        if (!process.env[key] && value !== '' && value !== null && value !== undefined) {
          process.env[key] = String(value);
        }
      }
    }
  } catch {
    // env.gateway.json not found
  }
}

// Ensure env vars are loaded before any database operations
loadEnvVars();

// Lazily-initialized singletons.
const g = global as unknown as {
  _pool?: Pool;
  _prisma?: PrismaClient;
  _initPromise?: Promise<PrismaClient>;
};

async function getPrisma(): Promise<PrismaClient> {
  if (g._prisma) return g._prisma;
  if (g._initPromise) return g._initPromise;

  g._initPromise = (async () => {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error('DATABASE_URL is not set. Check .env file.');
    const parsed = parseDbUrl(dbUrl);
    if (process.env.DB_PASSWORD) parsed.password = process.env.DB_PASSWORD;

    // Resolve hostname to a connectable IP (preferring whatever the OS / DNS returns)
    const resolvedHost = await resolveHost(parsed.host);

    const pool = new Pool({
      ...parsed,
      host: resolvedHost,
      max: 10,
      min: 2,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: { rejectUnauthorized: false },
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    });
    g._pool = pool;

    const client = new PrismaClient({
      adapter: new PrismaPg(pool),
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
    g._prisma = client;
    return client;
  })();

  return g._initPromise;
}

// Export a promise that resolves to the Prisma client
export const prisma: Promise<PrismaClient> = getPrisma();

export default prisma;
