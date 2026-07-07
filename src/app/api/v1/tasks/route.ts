import { NextResponse } from "next/server";
import { TaskService } from "@/modules/tasks/tasks.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "standard";
  try {
    const list = await TaskService.getTasks(type);
    return NextResponse.json({ success: true, list });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const task = await TaskService.createTask(body.title, body.desc, body.priority, body.type, null);
    return NextResponse.json({ success: true, task });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
