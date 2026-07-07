import { prisma } from "@/lib/db";

export class EventRepository {
  static async getList() {
    return await prisma.event.findMany({
      where: { deletedAt: null },
      include: { participants: { include: { profile: true } } },
      orderBy: { date: "asc" },
    });
  }

  static async create(tx: any, titleUz: string, titleRu: string, date: string) {
    return await tx.event.create({
      data: { titleUz, titleRu, date, status: "kutilmoqda" },
    });
  }

  static async updateStatus(tx: any, id: string, status: string) {
    return await tx.event.update({
      where: { id },
      data: { status },
    });
  }

  static async addParticipant(tx: any, eventId: string, profileId: string) {
    return await tx.eventParticipant.create({
      data: { eventId, profileId },
    });
  }
}
