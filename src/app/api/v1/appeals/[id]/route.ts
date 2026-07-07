import { NextResponse } from "next/server";
import { AppealService } from "@/modules/appeals/appeals.service";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const appeal = await AppealService.updateAppealStatus(id, body.status, null);
    return NextResponse.json({ success: true, appeal });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
