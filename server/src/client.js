/**
 * Prisma Client Singleton
 *
 * In production (serverless / long-running Node processes on AWS), importing
 * PrismaClient directly in every module would create a new connection pool per
 * hot-reload or import.  This singleton pattern ensures only ONE instance is
 * ever created for the lifetime of the process.
 *
 * Usage:  import prisma from './src/client.js';
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
