import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/jwt";
import { logActivity } from "@/lib/audit";

import { 
  mapRiskClientToDb, 
  mapRiskDbToClient, 
  mapGenderClientToDb, 
  mapGenderDbToClient 
} from "@/lib/utils";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;
  return await verifyAccessToken(token);
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const profile = await prisma.youthProfile.findFirst({
      where: { id, deletedAt: null },
      include: { mahalla: true }
    });

    if (!profile) {
      return NextResponse.json({ error: "Youth profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        ism: profile.ism,
        familiya: profile.familiya,
        jshshir: profile.jshshir,
        pasport: profile.pasport,
        yil: profile.yil,
        jins: mapGenderDbToClient(profile.jins),
        telefon: profile.telefon,
        davomat: profile.davomat,
        xavf: mapRiskDbToClient(profile.xavf),
        maktab: profile.maktab || "",
        izoh: profile.izoh || "",
        mahalla: profile.mahalla.nameUz,
        mahallaId: profile.mahallaId
      }
    });
  } catch (error: any) {
    console.error("GET youth profile by ID error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || !["admin", "uchastkavoy", "raisi", "yetakchi"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { ism, familiya, jshshir, pasport, yil, jins, telefon, davomat, xavf, maktab, izoh, mahallaId } = body;

    const existingProfile = await prisma.youthProfile.findFirst({
      where: { id, deletedAt: null }
    });

    if (!existingProfile) {
      return NextResponse.json({ error: "Youth profile not found" }, { status: 404 });
    }

    const updatedProfile = await prisma.youthProfile.update({
      where: { id },
      data: {
        ism,
        familiya,
        jshshir,
        pasport,
        yil: yil?.toString(),
        jins: jins ? mapGenderClientToDb(jins) : undefined,
        telefon,
        davomat: davomat?.toString(),
        xavf: xavf ? mapRiskClientToDb(xavf) : undefined,
        maktab,
        izoh,
        mahallaId
      },
      include: {
        mahalla: true
      }
    });

    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    await logActivity(
      user.id,
      "update_youth_profile",
      {
        message: `Updated youth profile ID: ${id} - ${ism} ${familiya}`,
        profileId: id,
        ism,
        familiya
      },
      ipAddress
    );


    return NextResponse.json({
      success: true,
      profile: {
        id: updatedProfile.id,
        ism: updatedProfile.ism,
        familiya: updatedProfile.familiya,
        jshshir: updatedProfile.jshshir,
        pasport: updatedProfile.pasport,
        yil: updatedProfile.yil,
        jins: mapGenderDbToClient(updatedProfile.jins),
        telefon: updatedProfile.telefon,
        davomat: updatedProfile.davomat,
        xavf: mapRiskDbToClient(updatedProfile.xavf),
        maktab: updatedProfile.maktab || "",
        izoh: updatedProfile.izoh || "",
        mahalla: updatedProfile.mahalla.nameUz,
        mahallaId: updatedProfile.mahallaId
      }
    });
  } catch (error: any) {
    console.error("PUT youth profile error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "JSHSHIR or Passport must be unique" }, { status: 400 });
    }
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
      return NextResponse.json({ error: "Only admins can delete profiles" }, { status: 401 });
    }

    const { id } = await params;
    const existingProfile = await prisma.youthProfile.findFirst({
      where: { id, deletedAt: null }
    });

    if (!existingProfile) {
      return NextResponse.json({ error: "Youth profile not found" }, { status: 404 });
    }

    await prisma.youthProfile.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    await logActivity(
      user.id,
      "delete_youth_profile",
      {
        message: `Soft-deleted youth profile: ${existingProfile.ism} ${existingProfile.familiya}`,
        profileId: id,
        ism: existingProfile.ism,
        familiya: existingProfile.familiya
      },
      ipAddress
    );


    return NextResponse.json({
      success: true,
      message: "Profile deleted successfully"
    });
  } catch (error: any) {
    console.error("DELETE youth profile error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
