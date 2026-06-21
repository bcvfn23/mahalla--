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

    const items = await prisma.appeal.findMany({
      where: { deletedAt: null },
      orderBy: { date: "desc" }
    });

    return NextResponse.json({
      success: true,
      items
    });
  } catch (error: any) {
    console.error("GET appeals error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fullName, type, text, status, predictedCategory } = await req.json();

    if (!fullName || !type || !text) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 });
    }

    const newAppeal = await prisma.appeal.create({
      data: {
        fullName,
        type,
        text,
        status: status || "yangi",
        predictedCategory: predictedCategory || "Boshqa",
        date: new Date().toISOString().slice(0, 16).replace("T", " ") // YYYY-MM-DD HH:MM
      }
    });

    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    await logActivity(
      user.id,
      "create_appeal",
      {
        message: `Registered appeal for: ${fullName} (Type: ${type})`,
        appealId: newAppeal.id,
        fullName,
        type
      },
      ipAddress
    );

    return NextResponse.json({
      success: true,
      item: newAppeal
    });

  } catch (error: any) {
    console.error("POST appeal error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
