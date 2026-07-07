import { PrismaClient } from "@prisma/client";
import { OutboxWorker } from "@/modules/event-bus/event-bus.service";
import { ConsistencyWatcher } from "@/modules/consistency/consistency-watcher";

const globalForPrisma = global as unknown as { prisma: PrismaClient; initialized: boolean };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

if (!globalForPrisma.initialized) {
  globalForPrisma.initialized = true;
  if (typeof window === "undefined") {
    console.log("🚀 [Enterprise Daemon] Starting Outbox Worker and Consistency Watcher...");
    OutboxWorker.start(5000);
    ConsistencyWatcher.start(30000);
  }
}
