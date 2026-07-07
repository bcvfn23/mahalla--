import { prisma } from "@/lib/db";
import { YouthRepository } from "./youth.repository";
import { YouthValidator } from "./youth.validator";
import { AuditService } from "../audit/audit.service";
import { EventBus } from "../event-bus/event-bus.service";

export class YouthService {
  static async createProfile(data: any, operatorId: string | null, ipAddress: string | null = null) {
    YouthValidator.validate(data);

    return await prisma.$transaction(async (tx) => {
      const profile = await YouthRepository.create(tx, {
        ism: data.ism,
        familiya: data.familiya,
        jshshir: data.jshshir,
        pasport: data.pasport,
        yil: data.yil.toString(),
        jins: data.jins,
        telefon: data.telefon,
        davomat: data.davomat || "100",
        xavf: data.xavf || "LOW",
        maktab: data.maktab || "",
        izoh: data.izoh || "",
        mahallaId: data.mahallaId,
      });

      await tx.attendance.create({
        data: {
          profileId: profile.id,
          date: new Date(),
          present: true,
        },
      });

      await EventBus.enqueueOutbox(tx, "YouthCreated_v1", {
        profileId: profile.id,
        ism: profile.ism,
        familiya: profile.familiya,
        jshshir: profile.jshshir,
      });

      await AuditService.log(operatorId, "create_youth_profile", { profileId: profile.id, ism: profile.ism, jshshir: profile.jshshir }, ipAddress);

      return profile;
    });
  }

  static async updateProfile(id: string, version: number, data: any, operatorId: string | null, ipAddress: string | null = null) {
    YouthValidator.validate(data);

    const before = await YouthRepository.findById(id);
    if (!before) throw new Error("EntityNotFoundException: Profile not found.");

    return await prisma.$transaction(async (tx) => {
      const profile = await YouthRepository.update(tx, id, version, {
        ism: data.ism,
        familiya: data.familiya,
        jshshir: data.jshshir,
        pasport: data.pasport,
        yil: data.yil.toString(),
        jins: data.jins,
        telefon: data.telefon,
        davomat: data.davomat || "100",
        xavf: data.xavf || "LOW",
        maktab: data.maktab || "",
        izoh: data.izoh || "",
        mahallaId: data.mahallaId,
      });

      await EventBus.enqueueOutbox(tx, "YouthUpdated_v1", { profileId: id });

      await AuditService.logDiff(operatorId, "update_youth_profile", before, profile, { profileId: id }, ipAddress);

      return profile;
    });
  }

  static async deleteProfile(id: string, operatorId: string | null, ipAddress: string | null = null) {
    const profile = await YouthRepository.findById(id);
    if (!profile) throw new Error("EntityNotFoundException: Profile not found.");

    return await prisma.$transaction(async (tx) => {
      await tx.attendance.deleteMany({ where: { profileId: id } });
      await tx.employment.deleteMany({ where: { profileId: id } });
      await tx.socialAid.deleteMany({ where: { profileId: id } });
      await tx.eventParticipant.deleteMany({ where: { profileId: id } });
      
      await YouthRepository.softDelete(tx, id);

      await EventBus.enqueueOutbox(tx, "YouthDeleted_v1", { profileId: id });

      await AuditService.log(operatorId, "delete_youth_profile", { profileId: id }, ipAddress);
      return true;
    });
  }
}
