import { prisma } from "@/lib/db";

export class IncidentRepository {
  static async getList() {
    return await prisma.incident.findMany({
      where: { deletedAt: null },
      include: { profile: true },
      orderBy: { date: "desc" },
    });
  }

  static async create(tx: any, data: any) {
    return await tx.incident.create({
      data: {
        profileId: data.profileId || null,
        name: data.name,
        typeUz: data.typeUz,
        typeRu: data.typeRu,
        locationUz: data.locationUz,
        locationRu: data.locationRu,
        status: data.status || "jarayonda",
        severity: data.severity || "low",
        date: new Date().toISOString().slice(0, 16).replace("T", " "),
      },
    });
  }

  static async update(tx: any, id: string, data: any) {
    return await tx.incident.update({
      where: { id },
      data: {
        status: data.status !== undefined ? data.status : undefined,
        severity: data.severity !== undefined ? data.severity : undefined,
      },
    });
  }

  static async softDelete(tx: any, id: string) {
    return await tx.incident.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
