import { NextResponse } from "next/server";
import { SocialAidService } from "@/modules/social-aid/social-aid.service";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const record = await SocialAidService.toggleAidStatus(id, body.status, null);
    return NextResponse.json({ success: true, record });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
