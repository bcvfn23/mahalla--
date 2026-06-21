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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || !["admin", "uchastkavoy"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status, severity } = await req.json();

    const existingIncident = await prisma.incident.findFirst({
      where: { id, deletedAt: null }
    });

    if (!existingIncident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    const updatedIncident = await prisma.incident.update({
      where: { id },
      data: {
        status: status !== undefined ? status : undefined,
        severity: severity !== undefined ? severity : undefined,
      }
    });

    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    await logActivity(
      user.id,
      "update_incident",
      {
        message: `Updated incident ID: ${id} (New Status: ${status})`,
        incidentId: id,
        status,
        severity
      },
      ipAddress
    );

    return NextResponse.json({
      success: true,
      item: updatedIncident
    });
  } catch (error: any) {
    console.error("PUT incident error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Only admins can delete incidents" }, { status: 401 });
    }

    const { id } = await params;
    const existingIncident = await prisma.incident.findFirst({
      where: { id, deletedAt: null }
    });

    if (!existingIncident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 });
    }

    await prisma.incident.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    await logActivity(
      user.id,
      "delete_incident",
      {
        message: `Soft-deleted incident for: ${existingIncident.name}`,
        incidentId: id
      },
      ipAddress
    );

    return NextResponse.json({
      success: true,
      message: "Incident deleted successfully"
    });
  } catch (error: any) {
    console.error("DELETE incident error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
