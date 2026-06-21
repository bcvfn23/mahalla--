import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const mahallas = await prisma.mahalla.findMany({
      orderBy: { nameUz: "asc" }
    });
    return NextResponse.json({ success: true, mahallas });
  } catch (error: any) {
    console.error("GET mahallas error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
