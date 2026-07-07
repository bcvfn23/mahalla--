import { prisma } from "@/lib/db";

export class SocialAidRepository {
  static async getList() {
    return await prisma.socialAid.findMany({
      where: { deletedAt: null },
      include: { profile: true },
    });
  }

  static async create(tx: any, profileId: string, notebookType: string, helpType: string) {
    return await tx.socialAid.create({
      data: { profileId, notebookType, helpType, status: "kutmoqda" },
    });
  }

  static async updateStatus(tx: any, id: string, status: string) {
    return await tx.socialAid.update({
      where: { id },
      data: { status },
    });
  }
}
