import { PrismaClient } from "@prisma/client"

import "server-only"

// This is needed to prevent multiple instances of Prisma Client in development
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Initialize prisma client
const prisma = global.prisma || new PrismaClient()

// In development, we want to use a single instance of Prisma Client
if (process.env.NODE_ENV !== "production") global.prisma = prisma

export { prisma }
