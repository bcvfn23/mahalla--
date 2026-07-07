import { prisma } from "@/lib/db";
import { EmploymentRepository } from "./employment.repository";
import { AuditService } from "../audit/audit.service";

export class EmploymentService {
  static async getEmployment(profileId: string) {
    return await EmploymentRepository.findByProfileId(profileId);
  }

  static async updateEmployment(profileId: string, profession: string, status: string, operatorId: string | null) {
    return await prisma.$transaction(async (tx) => {
      const record = await EmploymentRepository.upsert(tx, profileId, profession, status);
      await AuditService.log(operatorId, "update_employment", { profileId, status });
      return record;
    });
  }
}
