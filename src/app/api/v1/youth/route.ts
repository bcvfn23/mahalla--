import { NextResponse } from "next/server";
import { YouthService } from "@/modules/youth/youth.service";
import { YouthRepository } from "@/modules/youth/youth.repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const skip = parseInt(searchParams.get("skip") || "0");
  const limit = parseInt(searchParams.get("limit") || "100");
  const mahallaId = searchParams.get("mahallaId") || undefined;
  const xavf = searchParams.get("xavf") || undefined;

  const where: any = { deletedAt: null };
  if (mahallaId) where.mahallaId = mahallaId;
  if (xavf) where.xavf = xavf;

  try {
    const list = await YouthRepository.getList(where, skip, limit);
    const total = await YouthRepository.count(where);
    return NextResponse.json({ success: true, list, total });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const profile = await YouthService.createProfile(body, null);
    return NextResponse.json({ success: true, profile });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
