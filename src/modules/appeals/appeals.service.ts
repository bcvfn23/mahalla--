import { prisma } from "@/lib/db";
import { AppealRepository } from "./appeals.repository";
import { AuditService } from "../audit/audit.service";

export class AppealService {
  static async getAppeals() {
    return await AppealRepository.getList();
  }

  static async createAppeal(data: any, operatorId: string | null) {
    return await prisma.$transaction(async (tx) => {
      const appeal = await AppealRepository.create(tx, data);
      await AuditService.log(operatorId, "create_appeal", { id: appeal.id, fullName: appeal.fullName });
      return appeal;
    });
  }

  static async updateAppealStatus(id: string, status: string, operatorId: string | null) {
    return await prisma.$transaction(async (tx) => {
      const appeal = await AppealRepository.updateStatus(tx, id, status);
      await AuditService.log(operatorId, "update_appeal_status", { id, status });
      return appeal;
    });
  }
}
