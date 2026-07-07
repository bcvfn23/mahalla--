const fs = require("fs");
const path = require("path");

const baseDir = path.resolve(__dirname, "../src/app/api/v1");

const routes = {
  "youth/route.ts": `
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
`,

  "youth/[id]/route.ts": `
import { NextResponse } from "next/server";
import { YouthService } from "@/modules/youth/youth.service";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const profile = await YouthService.updateProfile(id, body.version || 1, body, null);
    return NextResponse.json({ success: true, profile });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await YouthService.deleteProfile(id, null);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
`,

  "statistics/route.ts": `
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const total = await prisma.youthProfile.count({ where: { deletedAt: null } });
    const highRisk = await prisma.youthProfile.count({ where: { xavf: "HIGH", deletedAt: null } });
    const mediumRisk = await prisma.youthProfile.count({ where: { xavf: "MEDIUM", deletedAt: null } });
    const lowRisk = await prisma.youthProfile.count({ where: { xavf: "LOW", deletedAt: null } });

    // Active incident calculations
    const activeIncidents = await prisma.incident.count({ where: { status: "jarayonda", deletedAt: null } });
    const totalIncidents = await prisma.incident.count({ where: { deletedAt: null } });

    // Calculate safe index
    const safeIndex = totalIncidents > 0 
      ? Math.round(((totalIncidents - activeIncidents) / totalIncidents) * 100)
      : 100;

    // Region & Mahalla stats
    const mahallas = await prisma.mahalla.findMany({
      include: {
        profiles: { where: { deletedAt: null } }
      }
    });

    const mahallaStats = mahallas.map(m => ({
      name: m.nameUz,
      total: m.profiles.length,
      highRisk: m.profiles.filter(p => p.xavf === "HIGH").length
    }));

    return NextResponse.json({
      success: true,
      data: {
        total,
        highRisk,
        mediumRisk,
        lowRisk,
        activeIncidents,
        totalIncidents,
        safeIndex,
        mahallaStats
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
`,

  "incidents/route.ts": `
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
`,

  "incidents/[id]/route.ts": `
import { NextResponse } from "next/server";
import { IncidentService } from "@/modules/incidents/incidents.service";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const incident = await IncidentService.updateIncident(id, body, null);
    return NextResponse.json({ success: true, incident });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await IncidentService.deleteIncident(id, null);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
`,

  "appeals/route.ts": `
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
`,

  "appeals/[id]/route.ts": `
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
`,

  "tasks/route.ts": `
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
`,

  "tasks/[id]/route.ts": `
import { NextResponse } from "next/server";
import { TaskService } from "@/modules/tasks/tasks.service";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const task = await TaskService.updateTaskStatus(id, body.status, null);
    return NextResponse.json({ success: true, task });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await TaskService.deleteTask(id, null);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
`,

  "events/route.ts": `
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
`,

  "events/[id]/route.ts": `
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
`,

  "social-aid/route.ts": `
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
`,

  "social-aid/[id]/route.ts": `
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
`,

  "integrity/route.ts": `
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
`
};

for (const [relPath, content] of Object.entries(routes)) {
  const fullPath = path.join(baseDir, relPath);
  const parentDir = path.dirname(fullPath);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content.trim() + "\n", "utf8");
  console.log(`Generated API Route: ${relPath}`);
}
console.log("All versioned v1 API routes generated successfully.");
