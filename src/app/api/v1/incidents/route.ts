import { NextResponse } from "next/server";
import { IncidentService } from "@/modules/incidents/incidents.service";

export async function GET() {
  try {
    const list = await IncidentService.getIncidents();
    return NextResponse.json({ success: true, list });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const incident = await IncidentService.createIncident(body, null);
    return NextResponse.json({ success: true, incident });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
