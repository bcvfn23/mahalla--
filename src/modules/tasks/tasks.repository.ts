import { prisma } from "@/lib/db";

export class TaskRepository {
  static async getList(type: string) {
    return await prisma.task.findMany({
      where: { type },
      orderBy: { createdAt: "desc" },
    });
  }

  static async create(tx: any, title: string, desc: string, priority: string, type: string) {
    return await tx.task.create({
      data: { title, desc, priority, type, status: type === "leader" ? "pending" : "todo" },
    });
  }

  static async updateStatus(tx: any, id: string, status: string) {
    return await tx.task.update({
      where: { id },
      data: { status },
    });
  }

  static async delete(tx: any, id: string) {
    return await tx.task.delete({ where: { id } });
  }
}
