#!/usr/bin/env node
// Register tsconfig-paths before any other imports
try {
  const { register } = require('tsconfig-paths');
  register({
    cwd: process.cwd(),
    baseUrl: '.',
    paths: {
      '@sprintpulse/*': ['./libs/*'],
    },
  });
  console.log('tsconfig-paths registered successfully');
} catch (e: any) {
  console.warn('tsconfig-paths registration failed:', e.message);
}

// Prisma client regenerated v2 - force restart
require('./server');
