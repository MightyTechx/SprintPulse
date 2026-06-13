// Automatically catches async errors thrown inside route handlers
import 'express-async-errors';

import express from 'express';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import fs from 'fs';

// Centralized error handling middleware
import { errorHandler, notFoundHandler } from '@infygen/middleware';

// Import route modules
import authRoutes from '../api/auth/Auth.routes';
import adminRoutes from '../api/admin/routes';

// Prisma client
import { prisma } from '@infygen/database';

// Constants for route paths
import { ADMIN_PATHS } from '@infygen/constants';

const app = express();

/**
 * -------------------------
 * Global Middleware
 * -------------------------
 */

// Gzip compress all responses — reduces payload size by 60-80%
app.use(compression());

// Enable CORS
app.use(cors());

// Parse incoming JSON requests
app.use(express.json({ limit: '10mb' }));

// Serve uploaded files statically
const uploadsDir = path.join(__dirname, '../../uploads/attachments');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads/attachments', express.static(uploadsDir));
// Return plain 404 for missing static files (prevent API notFoundHandler JSON response)
app.use('/uploads', (_req, res) => res.status(404).end());

/**
 * -------------------------
 * API Routes
 * -------------------------
 */

// Auth API routes
app.use('/api/auth', authRoutes);

// Admin API routes
app.use(`/api/${ADMIN_PATHS.ADMIN}`, adminRoutes);

/**
 * -------------------------
 * Health Check
 * -------------------------
 */

app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

/**
 * -------------------------
 * Error Handling
 * -------------------------
 */

// Handles unknown routes (404 errors)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
