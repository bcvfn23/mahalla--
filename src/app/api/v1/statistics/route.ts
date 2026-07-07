import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const total = await prisma.youthProfile.count({ where: { deletedAt: null } });
    const highRisk = await prisma.youthProfile.count({ where: { xavf: "HIGH", deletedAt: null } });
    const mediumRisk = await prisma.youthProfile.count({ where: { xavf: "MEDIUM", deletedAt: null } });
    const lowRisk = await prisma.youthProfile.count({ where: { xavf: "LOW", deletedAt: null } });

    // Active incident calculations
    const activeIncidents = await prisma.incident.count({ where: { status: "jarayonda", deletedAt: null } });
    const totalIncidents = await prisma.incident.count({ where: { deletedAt: null } });

    // Calculate safe index
    const safeIndex = totalIncidents > 0 
      ? Math.round(((totalIncidents - activeIncidents) / totalIncidents) * 100)
      : 100;

    // Region & Mahalla stats
    const mahallas = await prisma.mahalla.findMany({
      include: {
        profiles: { where: { deletedAt: null } }
      }
    });

    const mahallaStats = mahallas.map(m => ({
      name: m.nameUz,
      total: m.profiles.length,
      highRisk: m.profiles.filter(p => p.xavf === "HIGH").length
    }));

    return NextResponse.json({
      success: true,
      data: {
        total,
        highRisk,
        mediumRisk,
        lowRisk,
        activeIncidents,
        totalIncidents,
        safeIndex,
        mahallaStats
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
