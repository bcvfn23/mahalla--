import { NextResponse } from "next/server";
import { EventService } from "@/modules/events/events.service";

export async function GET() {
  try {
    const list = await EventService.getEvents();
    return NextResponse.json({ success: true, list });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event = await EventService.createEvent(body.titleUz, body.titleRu || body.titleUz, body.date, null);
    return NextResponse.json({ success: true, event });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
