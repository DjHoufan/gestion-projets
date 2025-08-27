// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // Empêche la recréation du client en dev/hot reload
  // ⚠️ Nécessaire dans Next.js App Router
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const db =
  globalThis.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
