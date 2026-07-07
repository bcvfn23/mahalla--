import { NextResponse } from "next/server";
import { EventService } from "@/modules/events/events.service";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const event = await EventService.updateEventStatus(id, body.status, null);
    return NextResponse.json({ success: true, event });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const participant = await EventService.registerParticipant(id, body.profileId, null);
    return NextResponse.json({ success: true, participant });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
