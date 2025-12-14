// Lazy-load Prisma client to avoid initialization during build
import type { PrismaClient as PrismaClientType } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientType | undefined;
};

// Lazy initialization function
function getPrismaClient(): PrismaClientType {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  // Dynamic import to avoid build-time initialization
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require("@/generated/prisma/client");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = new (PrismaClient as any)();

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}

// Export a proxy that lazily initializes the client
export const prisma = new Proxy({} as PrismaClientType, {
  get(_target, prop) {
    const client = getPrismaClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (client as any)[prop];
  },
});
