import { NextResponse } from "next/server";
import { SocialAidService } from "@/modules/social-aid/social-aid.service";

export async function GET() {
  try {
    const list = await SocialAidService.getList();
    return NextResponse.json({ success: true, list });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const record = await SocialAidService.addAidRecord(body.profileId, body.notebookType, body.helpType, null);
    return NextResponse.json({ success: true, record });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
