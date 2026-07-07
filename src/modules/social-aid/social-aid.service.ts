import { prisma } from "@/lib/db";
import { SocialAidRepository } from "./social-aid.repository";
import { AuditService } from "../audit/audit.service";

export class SocialAidService {
  static async getList() {
    return await SocialAidRepository.getList();
  }

  static async addAidRecord(profileId: string, notebookType: string, helpType: string, operatorId: string | null) {
    return await prisma.$transaction(async (tx) => {
      const record = await SocialAidRepository.create(tx, profileId, notebookType, helpType);
      await AuditService.log(operatorId, "create_social_aid", { profileId, notebookType });
      return record;
    });
  }

  static async toggleAidStatus(id: string, currentStatus: string, operatorId: string | null) {
    const nextStatus = currentStatus === "kutmoqda" ? "hal_etildi" : "kutmoqda";
    return await prisma.$transaction(async (tx) => {
      const record = await SocialAidRepository.updateStatus(tx, id, nextStatus);
      await AuditService.log(operatorId, "update_social_aid_status", { id, status: nextStatus });
      return record;
    });
  }
}
