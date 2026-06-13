import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const dbUrl = new URL(process.env.DATABASE_URL!);
if (process.env.DB_PASSWORD) dbUrl.password = encodeURIComponent(process.env.DB_PASSWORD);
const pool = new Pool({
  user: decodeURIComponent(dbUrl.username),
  password: process.env.DB_PASSWORD ?? decodeURIComponent(dbUrl.password),
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 5432,
  database: dbUrl.pathname.replace(/^\//, ''),
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
  adapter,
} as unknown as ConstructorParameters<typeof PrismaClient>[0]);

async function createTables() {
  console.log('Creating tables if not exist...');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" SERIAL PRIMARY KEY,
      "firstName" TEXT NOT NULL,
      "lastName" TEXT NOT NULL,
      "email" TEXT UNIQUE NOT NULL,
      "password" TEXT NOT NULL,
      "phone" TEXT,
      "workLocation" TEXT,
      "department" TEXT,
      "reasonForAccess" TEXT,
      "employeeId" TEXT,
      "businessUnit" TEXT,
      "managerName" TEXT,
      "dateOfBirth" TEXT,
      "profilePicture" TEXT,
      "name" TEXT NOT NULL,
      "role" TEXT NOT NULL DEFAULT 'user',
      "requestedRole" TEXT,
      "status" TEXT NOT NULL DEFAULT 'pending_approval',
      "source" TEXT NOT NULL DEFAULT 'signup',
      "reviewedBy" INTEGER,
      "reviewedAt" TIMESTAMP(3),
      "adminNotes" TEXT,
      "invitationToken" TEXT,
      "invitationExpiry" TIMESTAMP(3),
      "mustResetPassword" BOOLEAN NOT NULL DEFAULT false,
      "otp" TEXT,
      "otpExpiresAt" TIMESTAMP(3),
      "otpIsUsed" BOOLEAN DEFAULT false,
      "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
      "lockedUntil" TIMESTAMP(3),
      "lastLoginAt" TIMESTAMP(3),
      "passwordChangedAt" TIMESTAMP(3),
      "isActive" BOOLEAN NOT NULL DEFAULT false,
      "accessFromDate" TIMESTAMP(3),
      "accessToDate" TIMESTAMP(3),
      "firstActivationDate" TIMESTAMP(3),
      "lastDeactivationDate" TIMESTAMP(3),
      "lastActivityAt" TIMESTAMP(3),
      "timezone" TEXT,
      "dateFormat" TEXT,
      "timeFormat" TEXT,
      "language" TEXT,
      "consultantProfileUpdated" BOOLEAN NOT NULL DEFAULT false,
      "slaWorkingCalendar" TEXT,
      "slaExceptionGroup" TEXT,
      "application" TEXT,
      "applicationLead" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "UserChangeLog" (
      "id" SERIAL PRIMARY KEY,
      "userId" INTEGER NOT NULL,
      "changeType" TEXT NOT NULL,
      "fieldName" TEXT,
      "previousValue" TEXT,
      "newValue" TEXT,
      "changedBy" INTEGER NOT NULL,
      "changedByName" TEXT NOT NULL,
      "reasonCode" TEXT,
      "reasonNotes" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "LoginLog" (
      "id" SERIAL PRIMARY KEY,
      "userId" INTEGER NOT NULL,
      "loginTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "logoutTime" TIMESTAMP(3),
      "ipAddress" TEXT,
      "device" TEXT,
      "userAgent" TEXT
    );

    CREATE TABLE IF NOT EXISTS "FeatureFlag" (
      "id" SERIAL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "key" TEXT UNIQUE NOT NULL,
      "description" TEXT NOT NULL DEFAULT '',
      "environment" TEXT NOT NULL DEFAULT 'Development',
      "status" TEXT NOT NULL DEFAULT 'Disabled',
      "roles" TEXT NOT NULL DEFAULT '["Admin"]',
      "createdBy" INTEGER,
      "updatedBy" INTEGER,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('Tables created successfully.');
}

async function clearAndSeed() {
  console.log('Clearing existing data...');

  await pool.query(`
    DELETE FROM "UserChangeLog" WHERE true;
    DELETE FROM "LoginLog" WHERE true;
    DELETE FROM "FeatureFlag" WHERE true;
    DELETE FROM "User" WHERE true;
    ALTER SEQUENCE "User_id_seq" RESTART WITH 1;
    ALTER SEQUENCE "UserChangeLog_id_seq" RESTART WITH 1;
    ALTER SEQUENCE "LoginLog_id_seq" RESTART WITH 1;
    ALTER SEQUENCE "FeatureFlag_id_seq" RESTART WITH 1;
  `);

  console.log('Existing data cleared.');

  // Seed default users (admin, user, consultant)
  const adminPassword = await bcrypt.hash('Srinivas@SprintPulse123', 10);
  const userPassword = await bcrypt.hash('user123', 10);
  const consultantPassword = await bcrypt.hash('consultant123', 10);

  const now = new Date();

  await (prisma as any).user.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'srinivas.penumalla@infygen.tech',
      password: adminPassword,
      phone: '+1-555-0001',
      workLocation: 'New York - HQ',
      department: 'IT Administration',
      businessUnit: 'Technology',
      employeeId: 'EMP001',
      managerName: 'CTO Office',
      name: 'Admin User',
      role: 'admin',
      status: 'active',
      source: 'admin',
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      language: 'en',
      slaWorkingCalendar: 'Standard 8x5',
      slaExceptionGroup: 'US Federal Holidays',
      lastActivityAt: new Date(now.getTime() - 15 * 60 * 1000),
      failedLoginAttempts: 0,
      isActive: true,
      mustResetPassword: false,
      firstActivationDate: now,
      createdAt: now,
      updatedAt: now,
    },
  });

  await (prisma as any).user.create({
    data: {
      firstName: 'Regular',
      lastName: 'User',
      email: 'user@infygen.tech',
      password: userPassword,
      phone: '+1-555-0002',
      workLocation: 'Chicago - Branch',
      department: 'Finance',
      businessUnit: 'Corporate Services',
      employeeId: 'EMP002',
      managerName: 'Jane Manager',
      name: 'Regular User',
      role: 'user',
      status: 'active',
      source: 'admin',
      timezone: 'America/Chicago',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      language: 'en',
      slaWorkingCalendar: 'Standard 8x5',
      slaExceptionGroup: 'US Federal Holidays',
      lastActivityAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      failedLoginAttempts: 0,
      isActive: true,
      mustResetPassword: false,
      firstActivationDate: now,
      createdAt: now,
      updatedAt: now,
    },
  });

  await (prisma as any).user.create({
    data: {
      firstName: 'Consultant',
      lastName: 'User',
      email: 'consultant@infygen.tech',
      password: consultantPassword,
      phone: '+1-555-0003',
      workLocation: 'Remote',
      department: 'External Consulting',
      businessUnit: 'Professional Services',
      employeeId: 'CON001',
      managerName: 'Project Lead',
      reasonForAccess: 'Assigned to SerivceOps implementation project',
      name: 'Consultant User',
      role: 'consultant',
      status: 'active',
      source: 'admin',
      timezone: 'America/Los_Angeles',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '24h',
      language: 'en',
      slaWorkingCalendar: 'Extended 10x5',
      slaExceptionGroup: 'US Federal Holidays',
      lastActivityAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      failedLoginAttempts: 0,
      isActive: true,
      mustResetPassword: false,
      firstActivationDate: now,
      createdAt: now,
      updatedAt: now,
    },
  });

  // Seed default feature flags
  await pool.query(`
    INSERT INTO "FeatureFlag" ("name", "key", "description", "environment", "status", "roles", "createdAt", "updatedAt") VALUES
      ('People Management', 'nav_people_management', 'Enable people management for consultants', 'Development', 'Enabled', '["Admin","Consultant"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Analytics', 'nav_analytics', 'Enable analytics dashboard for consultants', 'Development', 'Disabled', '["Admin"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Reports', 'nav_reports', 'Enable generation reports for consultants', 'Development', 'Disabled', '["Admin"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('Technical Documents', 'nav_technical_documents', 'Enable technical documents for consultants', 'Development', 'Disabled', '["Admin"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
  `);

  console.log('Data seeded successfully!');
}

async function main() {
  console.log('Starting database seeding...');
  console.log('Database URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));

  await createTables();
  await clearAndSeed();

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });
