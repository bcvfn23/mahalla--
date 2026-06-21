import { prisma } from "./db";

export async function logActivity(
  userId: string | null,
  action: string,
  details: any,
  ipAddress?: string | null
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        details: details || {},
        ipAddress: ipAddress || "127.0.0.1",
      }
    });
  } catch (error) {
    console.error("Failed to record audit log:", error);
  }
}
