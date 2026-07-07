import { prisma } from "@/lib/db";

export class EmploymentRepository {
  static async findByProfileId(profileId: string) {
    return await prisma.employment.findUnique({ where: { profileId } });
  }

  static async upsert(tx: any, profileId: string, profession: string, status: string) {
    return await tx.employment.upsert({
      where: { profileId },
      update: { profession, status },
      create: { profileId, profession, status },
    });
  }
}
