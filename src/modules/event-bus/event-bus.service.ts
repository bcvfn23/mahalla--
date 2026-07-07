import { prisma } from "@/lib/db";
import { CacheService } from "../cache/cache.service";

export type SystemEvent =
  | "YouthCreated_v1"
  | "YouthUpdated_v1"
  | "YouthDeleted_v1"
  | "IncidentCreated_v1"
  | "IncidentUpdated_v1"
  | "AppealCreated_v1"
  | "TaskCompleted_v1";

type EventHandler = (payload: any) => Promise<void> | void;

export class EventBus {
  private static handlers: Record<string, EventHandler[]> = {};

  static subscribe(event: SystemEvent, handler: EventHandler) {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(handler);
  }

  static async publishLocal(event: string, payload: any) {
    const list = this.handlers[event] || [];
    for (const h of list) {
      try {
        await h(payload);
      } catch (err) {
        console.error(`Local handler failed for event ${event}:`, err);
      }
    }
  }

  static async enqueueOutbox(tx: any, eventType: SystemEvent, payload: any) {
    return await tx.eventOutbox.create({
      data: {
        eventType,
        eventVersion: 1,
        payload: payload || {},
      },
    });
  }
}

export class OutboxWorker {
  static async processOutbox() {
    try {
      const items = await prisma.eventOutbox.findMany({
        where: { processedAt: null, retryCount: { lt: 3 } },
        take: 10,
        orderBy: { createdAt: "asc" },
      });

      for (const item of items) {
        const idempotentKey = `outbox_${item.id}`;
        const alreadyProcessed = await prisma.idempotentConsumer.findUnique({
          where: { id: idempotentKey },
        });

        if (alreadyProcessed) {
          await prisma.eventOutbox.update({
            where: { id: item.id },
            data: { processedAt: new Date() },
          });
          continue;
        }

        try {
          await EventBus.publishLocal(item.eventType, item.payload);

          await prisma.$transaction(async (tx) => {
            await tx.idempotentConsumer.create({
              data: {
                id: idempotentKey,
                consumerName: "OutboxWorker_Handler",
              },
            });
            await tx.eventOutbox.update({
              where: { id: item.id },
              data: { processedAt: new Date() },
            });
          });

          CacheService.invalidateAll();
        } catch (err: any) {
          console.error(`OutboxWorker failed on event ID ${item.id}:`, err);
          await prisma.eventOutbox.update({
            where: { id: item.id },
            data: {
              retryCount: item.retryCount + 1,
              error: err.message || "Unknown error",
            },
          });
        }
      }
    } catch (e) {
      console.error("OutboxWorker loop error:", e);
    }
  }

  static start(intervalMs = 5000) {
    if (typeof window !== "undefined") return;
    setInterval(() => {
      this.processOutbox();
    }, intervalMs);
  }
}
