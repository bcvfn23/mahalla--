import { prisma } from "@/lib/db";

export class AppealRepository {
  static async getList() {
    return await prisma.appeal.findMany({
      where: { deletedAt: null },
      include: { profile: true },
      orderBy: { date: "desc" },
    });
  }

  static async create(tx: any, data: any) {
    return await tx.appeal.create({
      data: {
        profileId: data.profileId || null,
        fullName: data.fullName,
        type: data.type,
        text: data.text,
        date: new Date().toISOString().slice(0, 16).replace("T", " "),
        status: "yangi",
        predictedCategory: data.predictedCategory || null,
      },
    });
  }

  static async updateStatus(tx: any, id: string, status: string) {
    return await tx.appeal.update({
      where: { id },
      data: { status },
    });
  }
}
