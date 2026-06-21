import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/jwt";
import { logActivity } from "@/lib/audit";


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

    const items = await prisma.incident.findMany({
      where: { deletedAt: null },
      orderBy: { date: "desc" }
    });

    return NextResponse.json({
      success: true,
      items
    });
  } catch (error: any) {
    console.error("GET incidents error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || !["admin", "uchastkavoy"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, typeUz, typeRu, locationUz, locationRu, status, severity } = await req.json();

    if (!name || !typeUz || !typeRu || !locationUz || !locationRu) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    const newIncident = await prisma.incident.create({
      data: {
        name,
        typeUz,
        typeRu,
        locationUz,
        locationRu,
        status: status || "jarayonda",
        severity: severity || "low",
        date: new Date().toISOString().slice(0, 16).replace("T", " ") // YYYY-MM-DD HH:MM
      }
    });

    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    await logActivity(
      user.id,
      "create_incident",
      {
        message: `Reported incident for: ${name} (Type: ${typeUz})`,
        incidentId: newIncident.id,
        name,
        typeUz
      },
      ipAddress
    );


    return NextResponse.json({
      success: true,
      item: newIncident
    });
  } catch (error: any) {
    console.error("POST incident error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
