import { prisma } from "@/lib/db";

export class YouthRepository {
  static async findById(id: string) {
    return await prisma.youthProfile.findFirst({
      where: { id, deletedAt: null },
      include: { mahalla: true, employment: true, socialAid: true },
    });
  }

  static async getList(where: any, skip: number, limit: number) {
    return await prisma.youthProfile.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: { mahalla: true },
    });
  }

  static async count(where: any) {
    return await prisma.youthProfile.count({ where });
  }

  static async create(tx: any, data: any) {
    return await tx.youthProfile.create({
      data,
      include: { mahalla: true },
    });
  }

  static async update(tx: any, id: string, version: number, data: any) {
    const updated = await tx.youthProfile.updateMany({
      where: { id, version, deletedAt: null },
      data: { ...data, version: version + 1 },
    });
    if (updated.count === 0) {
      throw new Error("ConcurrencyConflictException: Profile was modified by another operator. Please reload and retry.");
    }
    return await tx.youthProfile.findFirst({ where: { id } });
  }

  static async softDelete(tx: any, id: string) {
    return await tx.youthProfile.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
