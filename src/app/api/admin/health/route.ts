import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/jwt";

async function getAuthenticatedAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;
  const user = await verifyAccessToken(token);
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function GET() {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 401 });
    }

    // 1. Check Database connection
    let databaseStatus = "ok";
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbError) {
      console.error("Database health check failed:", dbError);
      databaseStatus = "error";
    }

    // 2. Check Memory usage
    const memory = process.memoryUsage();
    const formattedMemory = {
      rss: `${Math.round(memory.rss / 1024 / 1024 * 100) / 100} MB`,
      heapTotal: `${Math.round(memory.heapTotal / 1024 / 1024 * 100) / 100} MB`,
      heapUsed: `${Math.round(memory.heapUsed / 1024 / 1024 * 100) / 100} MB`,
      external: `${Math.round(memory.external / 1024 / 1024 * 100) / 100} MB`,
    };

    // 3. Check Sentry DSN configuration
    const sentryStatus = process.env.SENTRY_DSN ? "configured" : "not_configured";

    const isSystemHealthy = databaseStatus === "ok";

    return NextResponse.json({
      status: isSystemHealthy ? "healthy" : "unhealthy",
      database: databaseStatus,
      sentry: sentryStatus,
      memory: formattedMemory,
      uptime: `${process.uptime()} seconds`
    }, {
      status: isSystemHealthy ? 200 : 500
    });
  } catch (error: any) {
    console.error("Admin health check API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
