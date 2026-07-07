import { AuditRepository } from "./audit.repository";

export class AuditService {
  static async log(userId: string | null, action: string, details: any, ipAddress: string | null = null) {
    return await AuditRepository.createLog(userId, action, details, null, ipAddress);
  }

  static async logDiff(userId: string | null, action: string, beforeState: any, afterState: any, details: any, ipAddress: string | null = null) {
    const stateDiff = {
      before: beforeState,
      after: afterState,
    };
    return await AuditRepository.createLog(userId, action, details, stateDiff, ipAddress);
  }
}
