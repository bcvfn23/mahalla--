import { prisma } from "@/lib/db";

export class AuditRepository {
  static async createLog(userId: string | null, action: string, details: any, stateDiff: any | null, ipAddress: string | null) {
    return await prisma.auditLog.create({
      data: {
        userId,
        action,
        details: details || {},
        stateDiff: stateDiff || undefined,
        ipAddress,
      },
    });
  }
}
