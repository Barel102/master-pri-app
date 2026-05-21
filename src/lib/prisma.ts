import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma/client";

/** Bump when changing database adapter so dev HMR does not reuse a stale client. */
const PRISMA_ADAPTER_KEY = "libsql-v2";

function createPrismaClient() {
  const url = process.env.DATABASE_URL ?? "file:./dev.db";
  const authToken = process.env.TURSO_AUTH_TOKEN;
  const isRemote = url.startsWith("libsql:") || url.startsWith("https:");

  const adapter = new PrismaLibSql(
    isRemote && authToken ? { url, authToken } : { url },
  );

  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaAdapterKey?: string;
};

function getPrismaClient(): PrismaClient {
  if (
    globalForPrisma.prisma &&
    globalForPrisma.prismaAdapterKey === PRISMA_ADAPTER_KEY
  ) {
    return globalForPrisma.prisma;
  }

  const client = createPrismaClient();
  globalForPrisma.prisma = client;
  globalForPrisma.prismaAdapterKey = PRISMA_ADAPTER_KEY;
  return client;
}

export const prisma = getPrismaClient();
