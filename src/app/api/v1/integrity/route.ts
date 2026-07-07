import { NextResponse } from "next/server";
import { ConsistencyReporter } from "@/modules/consistency/consistency-reporter";

export async function GET() {
  try {
    const report = await ConsistencyReporter.getReport();
    return NextResponse.json({ success: true, report });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
