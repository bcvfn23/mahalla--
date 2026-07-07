import { NextResponse } from "next/server";
import { AppealService } from "@/modules/appeals/appeals.service";

export async function GET() {
  try {
    const list = await AppealService.getAppeals();
    return NextResponse.json({ success: true, list });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const appeal = await AppealService.createAppeal(body, null);
    return NextResponse.json({ success: true, appeal });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
