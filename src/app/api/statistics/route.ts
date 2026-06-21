import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/jwt";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;
  return await verifyAccessToken(token);
}

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [youthCount, incidentsCount, appealsCount] = await Promise.all([
      prisma.youthProfile.count(),
      prisma.incident.count(),
      prisma.appeal.count()
    ]);

    return NextResponse.json({
      success: true,
      youthCount,
      incidentsCount,
      appealsCount
    });
  } catch (error: any) {
    console.error("GET statistics error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
