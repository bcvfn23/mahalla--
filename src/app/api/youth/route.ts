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

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const xavf = searchParams.get("xavf") || "";
    const mahalla = searchParams.get("mahalla") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = { deletedAt: null };

    if (search) {
      where.OR = [
        { ism: { contains: search } },
        { familiya: { contains: search } },
        { jshshir: { contains: search } },
        { pasport: { contains: search } },
      ];
    }

    if (xavf) {
      where.xavf = mapRiskClientToDb(xavf);
    }

    if (mahalla) {
      where.mahalla = {
        nameUz: { contains: mahalla }
      };
    }

    const [total, items] = await Promise.all([
      prisma.youthProfile.count({ where }),
      prisma.youthProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: { mahalla: true }
      })
    ]);

    return NextResponse.json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      items: items.map(y => ({
        id: y.id,
        ism: y.ism,
        familiya: y.familiya,
        jshshir: y.jshshir,
        pasport: y.pasport,
        yil: y.yil,
        jins: mapGenderDbToClient(y.jins),
        telefon: y.telefon,
        davomat: y.davomat,
        xavf: mapRiskDbToClient(y.xavf),
        maktab: y.maktab || "",
        izoh: y.izoh || "",
        mahalla: y.mahalla.nameUz,
        mahallaId: y.mahallaId
      }))
    });
  } catch (error: any) {
    console.error("GET youth profiles error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user || !["admin", "uchastkavoy", "raisi", "yetakchi"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { ism, familiya, jshshir, pasport, yil, jins, telefon, davomat, xavf, maktab, izoh, mahallaId } = body;

    if (!ism || !familiya || !jshshir || !pasport || !yil || !jins || !telefon || !mahallaId) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    const newProfile = await prisma.youthProfile.create({
      data: {
        ism,
        familiya,
        jshshir,
        pasport,
        yil: yil.toString(),
        jins: mapGenderClientToDb(jins),
        telefon,
        davomat: davomat?.toString() || "100",
        xavf: mapRiskClientToDb(xavf || "Past xavf"),
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
      "create_youth_profile",
      { 
        message: `Created youth profile: ${ism} ${familiya} (JSHSHIR: ${jshshir})`,
        profileId: newProfile.id,
        ism,
        familiya,
        jshshir
      },
      ipAddress
    );


    return NextResponse.json({
      success: true,
      profile: {
        id: newProfile.id,
        ism: newProfile.ism,
        familiya: newProfile.familiya,
        jshshir: newProfile.jshshir,
        pasport: newProfile.pasport,
        yil: newProfile.yil,
        jins: mapGenderDbToClient(newProfile.jins),
        telefon: newProfile.telefon,
        davomat: newProfile.davomat,
        xavf: mapRiskDbToClient(newProfile.xavf),
        maktab: newProfile.maktab || "",
        izoh: newProfile.izoh || "",
        mahalla: newProfile.mahalla.nameUz,
        mahallaId: newProfile.mahallaId
      }
    });
  } catch (error: any) {
    console.error("POST youth profile error:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "JSHSHIR or Passport must be unique" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
