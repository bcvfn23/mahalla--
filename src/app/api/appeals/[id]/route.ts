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
    if (!user || !["admin", "raisi", "yetakchi"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status, predictedCategory } = await req.json();

    const existingAppeal = await prisma.appeal.findFirst({
      where: { id, deletedAt: null }
    });

    if (!existingAppeal) {
      return NextResponse.json({ error: "Appeal not found" }, { status: 404 });
    }

    const updatedAppeal = await prisma.appeal.update({
      where: { id },
      data: {
        status: status !== undefined ? status : undefined,
        predictedCategory: predictedCategory !== undefined ? predictedCategory : undefined,
      }
    });

    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    await logActivity(
      user.id,
      "update_appeal",
      {
        message: `Updated appeal ID: ${id} (New Status: ${status})`,
        appealId: id,
        status,
        predictedCategory
      },
      ipAddress
    );

    return NextResponse.json({
      success: true,
      item: updatedAppeal
    });
  } catch (error: any) {
    console.error("PUT appeal error:", error);
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
      return NextResponse.json({ error: "Only admins can delete appeals" }, { status: 401 });
    }

    const { id } = await params;
    const existingAppeal = await prisma.appeal.findFirst({
      where: { id, deletedAt: null }
    });

    if (!existingAppeal) {
      return NextResponse.json({ error: "Appeal not found" }, { status: 404 });
    }

    await prisma.appeal.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    await logActivity(
      user.id,
      "delete_appeal",
      {
        message: `Soft-deleted appeal for: ${existingAppeal.fullName}`,
        appealId: id
      },
      ipAddress
    );

    return NextResponse.json({
      success: true,
      message: "Appeal deleted successfully"
    });
  } catch (error: any) {
    console.error("DELETE appeal error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
