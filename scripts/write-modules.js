const fs = require("fs");
const path = require("path");

const baseDir = path.resolve(__dirname, "../src/modules");

const modules = {
  "config/config.service.ts": `
export class ConfigService {
  static get auth() {
    return {
      accessTokenSecret: process.env.JWT_ACCESS_SECRET || "yoshlar-qalqoni-super-secret-access-token-key-2026",
      refreshTokenSecret: process.env.JWT_REFRESH_SECRET || "yoshlar-qalqoni-super-secret-refresh-token-key-2026",
      accessTokenExpiry: "15m",
      refreshTokenExpiry: "7d",
    };
  }

  static get database() {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("Configuration Error: DATABASE_URL environment variable is missing.");
    }
    return { url };
  }

  static get ai() {
    return {
      apiKey: process.env.GEMINI_API_KEY || "",
      modelName: "gemini-2.5-flash",
    };
  }

  static get cache() {
    return {
      defaultTtlMs: 300000,
    };
  }

  static get security() {
    return {
      maxLoginAttempts: 5,
      lockoutDurationMs: 900000,
    };
  }
}
`,

  "audit/audit.repository.ts": `
import { prisma } from "@/lib/db";

export class AuditRepository {
  static async createLog(userId: string | null, action: string, details: any, stateDiff: any | null, ipAddress: string | null) {
    return await prisma.auditLog.create({
      data: {
        userId,
        action,
        details: details || {},
        stateDiff: stateDiff || undefined,
        ipAddress,
      },
    });
  }
}
`,

  "audit/audit.service.ts": `
import { AuditRepository } from "./audit.repository";

export class AuditService {
  static async log(userId: string | null, action: string, details: any, ipAddress: string | null = null) {
    return await AuditRepository.createLog(userId, action, details, null, ipAddress);
  }

  static async logDiff(userId: string | null, action: string, beforeState: any, afterState: any, details: any, ipAddress: string | null = null) {
    const stateDiff = {
      before: beforeState,
      after: afterState,
    };
    return await AuditRepository.createLog(userId, action, details, stateDiff, ipAddress);
  }
}
`,

  "policy/policy.service.ts": `
export type Action = 
  | "CanCreateProfile"
  | "CanUpdateProfile"
  | "CanDeleteProfile"
  | "CanDeleteIncident"
  | "CanViewAudit"
  | "CanManageUsers"
  | "CanExportReports";

export class PolicyEngine {
  static check(user: { id: string; role: string }, action: Action): boolean {
    const role = user.role;
    if (role === "admin") return true;

    switch (action) {
      case "CanCreateProfile":
      case "CanUpdateProfile":
        return ["raisi", "yetakchi", "uchastkavoy"].includes(role);
      case "CanDeleteProfile":
      case "CanDeleteIncident":
      case "CanViewAudit":
      case "CanManageUsers":
        return false;
      case "CanExportReports":
        return role === "raisi";
      default:
        return false;
    }
  }

  static checkAbac(user: { role: string; assignedMahallaId?: string }, targetMahallaId: string): boolean {
    if (user.role === "admin") return true;
    if (!user.assignedMahallaId) return true;
    return user.assignedMahallaId === targetMahallaId;
  }
}
`,

  "cache/cache.service.ts": `
import { ConfigService } from "../config/config.service";

export class CacheService {
  private static store = new Map<string, { value: any; expiresAt: number }>();

  static get<T>(key: string): T | null {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value as T;
  }

  static set(key: string, value: any, ttlMs: number = ConfigService.cache.defaultTtlMs): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  static invalidate(key: string): void {
    this.store.delete(key);
  }

  static invalidateAll(): void {
    this.store.clear();
  }
}
`,

  "event-bus/event-bus.service.ts": `
import { prisma } from "@/lib/db";
import { CacheService } from "../cache/cache.service";

export type SystemEvent =
  | "YouthCreated_v1"
  | "YouthUpdated_v1"
  | "YouthDeleted_v1"
  | "IncidentCreated_v1"
  | "IncidentUpdated_v1"
  | "AppealCreated_v1"
  | "TaskCompleted_v1";

type EventHandler = (payload: any) => Promise<void> | void;

export class EventBus {
  private static handlers: Record<string, EventHandler[]> = {};

  static subscribe(event: SystemEvent, handler: EventHandler) {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(handler);
  }

  static async publishLocal(event: string, payload: any) {
    const list = this.handlers[event] || [];
    for (const h of list) {
      try {
        await h(payload);
      } catch (err) {
        console.error(\`Local handler failed for event \${event}:\`, err);
      }
    }
  }

  static async enqueueOutbox(tx: any, eventType: SystemEvent, payload: any) {
    return await tx.eventOutbox.create({
      data: {
        eventType,
        eventVersion: 1,
        payload: payload || {},
      },
    });
  }
}

export class OutboxWorker {
  static async processOutbox() {
    try {
      const items = await prisma.eventOutbox.findMany({
        where: { processedAt: null, retryCount: { lt: 3 } },
        take: 10,
        orderBy: { createdAt: "asc" },
      });

      for (const item of items) {
        const idempotentKey = \`outbox_\${item.id}\`;
        const alreadyProcessed = await prisma.idempotentConsumer.findUnique({
          where: { id: idempotentKey },
        });

        if (alreadyProcessed) {
          await prisma.eventOutbox.update({
            where: { id: item.id },
            data: { processedAt: new Date() },
          });
          continue;
        }

        try {
          await EventBus.publishLocal(item.eventType, item.payload);

          await prisma.$transaction(async (tx) => {
            await tx.idempotentConsumer.create({
              data: {
                id: idempotentKey,
                consumerName: "OutboxWorker_Handler",
              },
            });
            await tx.eventOutbox.update({
              where: { id: item.id },
              data: { processedAt: new Date() },
            });
          });

          CacheService.invalidateAll();
        } catch (err: any) {
          console.error(\`OutboxWorker failed on event ID \${item.id}:\`, err);
          await prisma.eventOutbox.update({
            where: { id: item.id },
            data: {
              retryCount: item.retryCount + 1,
              error: err.message || "Unknown error",
            },
          });
        }
      }
    } catch (e) {
      console.error("OutboxWorker loop error:", e);
    }
  }

  static start(intervalMs = 5000) {
    if (typeof window !== "undefined") return;
    setInterval(() => {
      this.processOutbox();
    }, intervalMs);
  }
}
`,

  "search/search.service.ts": `
import { prisma } from "@/lib/db";

export class SearchService {
  static async searchYouth(query: string) {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return await prisma.youthProfile.findMany({
      where: {
        deletedAt: null,
        OR: [
          { ism: { contains: q, mode: "insensitive" } },
          { familiya: { contains: q, mode: "insensitive" } },
          { jshshir: { contains: q } },
          { pasport: { contains: q } },
        ],
      },
      include: { mahalla: true },
    });
  }
}
`,

  "notification/notification.service.ts": `
export class NotificationService {
  static async sendSystemAlert(message: string, type: "info" | "warning" | "error" = "info") {
    console.log(\`[Notification Service] [\${type.toUpperCase()}]: \${message}\`);
  }
}
`,

  "consistency/consistency.types.ts": `
export interface ConsistencyReport {
  score: number;
  inconsistencies: Array<{
    module: string;
    expected: any;
    actual: any;
    severity: "low" | "medium" | "critical";
  }>;
}
`,

  "consistency/consistency-checker.ts": `
import { prisma } from "@/lib/db";
import { ConsistencyReport } from "./consistency.types";

export class ConsistencyChecker {
  static async check(): Promise<ConsistencyReport> {
    const inconsistencies: any[] = [];
    try {
      const youthCount = await prisma.youthProfile.count({ where: { deletedAt: null } });
      const incidentsCount = await prisma.incident.count({ where: { deletedAt: null } });
      const activeIncidentsCount = await prisma.incident.count({ where: { status: "jarayonda", deletedAt: null } });
      const appealsCount = await prisma.appeal.count({ where: { deletedAt: null } });

      // Consistency check logic
    } catch (e) {
      console.error("Consistency check failed", e);
    }
    const score = inconsistencies.length === 0 ? 100 : Math.max(0, 100 - inconsistencies.length * 10);
    return { score, inconsistencies };
  }
}
`,

  "consistency/consistency-repair.ts": `
import { CacheService } from "../cache/cache.service";
import { ConsistencyReport } from "./consistency.types";

export class ConsistencyRepair {
  static async heal(report: ConsistencyReport): Promise<boolean> {
    if (report.score < 100) {
      CacheService.invalidateAll();
      return true;
    }
    return false;
  }
}
`,

  "consistency/consistency-watcher.ts": `
import { ConsistencyChecker } from "./consistency-checker";
import { ConsistencyRepair } from "./consistency-repair";

export class ConsistencyWatcher {
  static start(intervalMs = 30000) {
    if (typeof window !== "undefined") return;
    setInterval(async () => {
      const report = await ConsistencyChecker.check();
      if (report.score < 100) {
        await ConsistencyRepair.heal(report);
      }
    }, intervalMs);
  }
}
`,

  "consistency/consistency-reporter.ts": `
import { ConsistencyChecker } from "./consistency-checker";
import { ConsistencyReport } from "./consistency.types";

export class ConsistencyReporter {
  static async getReport(): Promise<ConsistencyReport> {
    return await ConsistencyChecker.check();
  }
}
`,

  "youth/youth.validator.ts": `
export class YouthValidator {
  static validate(data: any) {
    if (!data.ism || data.ism.trim().length < 2) throw new Error("ValidationException: Firstname must be at least 2 characters.");
    if (!data.familiya || data.familiya.trim().length < 2) throw new Error("ValidationException: Lastname must be at least 2 characters.");
    if (!/^\\d{14}$/.test(data.jshshir)) throw new Error("ValidationException: JSHSHIR must be exactly 14 digits.");
    if (!/^[A-Z]{2}\\d{7}$/.test(data.pasport)) throw new Error("ValidationException: Passport must match format AA1234567.");
    const yilNum = parseInt(data.yil);
    if (isNaN(yilNum) || yilNum < 1990 || yilNum > 2012) {
      throw new Error("ValidationException: Birth year must represent youth age group (14 to 35).");
    }
  }
}
`,

  "youth/youth.repository.ts": `
import { prisma } from "@/lib/db";

export class YouthRepository {
  static async findById(id: string) {
    return await prisma.youthProfile.findFirst({
      where: { id, deletedAt: null },
      include: { mahalla: true, employment: true, socialAid: true },
    });
  }

  static async getList(where: any, skip: number, limit: number) {
    return await prisma.youthProfile.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: { mahalla: true },
    });
  }

  static async count(where: any) {
    return await prisma.youthProfile.count({ where });
  }

  static async create(tx: any, data: any) {
    return await tx.youthProfile.create({
      data,
      include: { mahalla: true },
    });
  }

  static async update(tx: any, id: string, version: number, data: any) {
    const updated = await tx.youthProfile.updateMany({
      where: { id, version, deletedAt: null },
      data: { ...data, version: version + 1 },
    });
    if (updated.count === 0) {
      throw new Error("ConcurrencyConflictException: Profile was modified by another operator. Please reload and retry.");
    }
    return await tx.youthProfile.findFirst({ where: { id } });
  }

  static async softDelete(tx: any, id: string) {
    return await tx.youthProfile.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
`,

  "youth/youth.service.ts": `
import { prisma } from "@/lib/db";
import { YouthRepository } from "./youth.repository";
import { YouthValidator } from "./youth.validator";
import { AuditService } from "../audit/audit.service";
import { EventBus } from "../event-bus/event-bus.service";

export class YouthService {
  static async createProfile(data: any, operatorId: string | null, ipAddress: string | null = null) {
    YouthValidator.validate(data);

    return await prisma.$transaction(async (tx) => {
      const profile = await YouthRepository.create(tx, {
        ism: data.ism,
        familiya: data.familiya,
        jshshir: data.jshshir,
        pasport: data.pasport,
        yil: data.yil.toString(),
        jins: data.jins,
        telefon: data.telefon,
        davomat: data.davomat || "100",
        xavf: data.xavf || "LOW",
        maktab: data.maktab || "",
        izoh: data.izoh || "",
        mahallaId: data.mahallaId,
      });

      await tx.attendance.create({
        data: {
          profileId: profile.id,
          date: new Date(),
          present: true,
        },
      });

      await EventBus.enqueueOutbox(tx, "YouthCreated_v1", {
        profileId: profile.id,
        ism: profile.ism,
        familiya: profile.familiya,
        jshshir: profile.jshshir,
      });

      await AuditService.log(operatorId, "create_youth_profile", { profileId: profile.id, ism: profile.ism, jshshir: profile.jshshir }, ipAddress);

      return profile;
    });
  }

  static async updateProfile(id: string, version: number, data: any, operatorId: string | null, ipAddress: string | null = null) {
    YouthValidator.validate(data);

    const before = await YouthRepository.findById(id);
    if (!before) throw new Error("EntityNotFoundException: Profile not found.");

    return await prisma.$transaction(async (tx) => {
      const profile = await YouthRepository.update(tx, id, version, {
        ism: data.ism,
        familiya: data.familiya,
        jshshir: data.jshshir,
        pasport: data.pasport,
        yil: data.yil.toString(),
        jins: data.jins,
        telefon: data.telefon,
        davomat: data.davomat || "100",
        xavf: data.xavf || "LOW",
        maktab: data.maktab || "",
        izoh: data.izoh || "",
        mahallaId: data.mahallaId,
      });

      await EventBus.enqueueOutbox(tx, "YouthUpdated_v1", { profileId: id });

      await AuditService.logDiff(operatorId, "update_youth_profile", before, profile, { profileId: id }, ipAddress);

      return profile;
    });
  }

  static async deleteProfile(id: string, operatorId: string | null, ipAddress: string | null = null) {
    const profile = await YouthRepository.findById(id);
    if (!profile) throw new Error("EntityNotFoundException: Profile not found.");

    return await prisma.$transaction(async (tx) => {
      await tx.attendance.deleteMany({ where: { profileId: id } });
      await tx.employment.deleteMany({ where: { profileId: id } });
      await tx.socialAid.deleteMany({ where: { profileId: id } });
      await tx.eventParticipant.deleteMany({ where: { profileId: id } });
      
      await YouthRepository.softDelete(tx, id);

      await EventBus.enqueueOutbox(tx, "YouthDeleted_v1", { profileId: id });

      await AuditService.log(operatorId, "delete_youth_profile", { profileId: id }, ipAddress);
      return true;
    });
  }
}
`,

  "employment/employment.repository.ts": `
import { prisma } from "@/lib/db";

export class EmploymentRepository {
  static async findByProfileId(profileId: string) {
    return await prisma.employment.findUnique({ where: { profileId } });
  }

  static async upsert(tx: any, profileId: string, profession: string, status: string) {
    return await tx.employment.upsert({
      where: { profileId },
      update: { profession, status },
      create: { profileId, profession, status },
    });
  }
}
`,

  "employment/employment.service.ts": `
import { prisma } from "@/lib/db";
import { EmploymentRepository } from "./employment.repository";
import { AuditService } from "../audit/audit.service";

export class EmploymentService {
  static async getEmployment(profileId: string) {
    return await EmploymentRepository.findByProfileId(profileId);
  }

  static async updateEmployment(profileId: string, profession: string, status: string, operatorId: string | null) {
    return await prisma.$transaction(async (tx) => {
      const record = await EmploymentRepository.upsert(tx, profileId, profession, status);
      await AuditService.log(operatorId, "update_employment", { profileId, status });
      return record;
    });
  }
}
`,

  "social-aid/social-aid.repository.ts": `
import { prisma } from "@/lib/db";

export class SocialAidRepository {
  static async getList() {
    return await prisma.socialAid.findMany({
      where: { deletedAt: null },
      include: { profile: true },
    });
  }

  static async create(tx: any, profileId: string, notebookType: string, helpType: string) {
    return await tx.socialAid.create({
      data: { profileId, notebookType, helpType, status: "kutmoqda" },
    });
  }

  static async updateStatus(tx: any, id: string, status: string) {
    return await tx.socialAid.update({
      where: { id },
      data: { status },
    });
  }
}
`,

  "social-aid/social-aid.service.ts": `
import { prisma } from "@/lib/db";
import { SocialAidRepository } from "./social-aid.repository";
import { AuditService } from "../audit/audit.service";

export class SocialAidService {
  static async getList() {
    return await SocialAidRepository.getList();
  }

  static async addAidRecord(profileId: string, notebookType: string, helpType: string, operatorId: string | null) {
    return await prisma.$transaction(async (tx) => {
      const record = await SocialAidRepository.create(tx, profileId, notebookType, helpType);
      await AuditService.log(operatorId, "create_social_aid", { profileId, notebookType });
      return record;
    });
  }

  static async toggleAidStatus(id: string, currentStatus: string, operatorId: string | null) {
    const nextStatus = currentStatus === "kutmoqda" ? "hal_etildi" : "kutmoqda";
    return await prisma.$transaction(async (tx) => {
      const record = await SocialAidRepository.updateStatus(tx, id, nextStatus);
      await AuditService.log(operatorId, "update_social_aid_status", { id, status: nextStatus });
      return record;
    });
  }
}
`,

  "tasks/tasks.repository.ts": `
import { prisma } from "@/lib/db";

export class TaskRepository {
  static async getList(type: string) {
    return await prisma.task.findMany({
      where: { type },
      orderBy: { createdAt: "desc" },
    });
  }

  static async create(tx: any, title: string, desc: string, priority: string, type: string) {
    return await tx.task.create({
      data: { title, desc, priority, type, status: type === "leader" ? "pending" : "todo" },
    });
  }

  static async updateStatus(tx: any, id: string, status: string) {
    return await tx.task.update({
      where: { id },
      data: { status },
    });
  }

  static async delete(tx: any, id: string) {
    return await tx.task.delete({ where: { id } });
  }
}
`,

  "tasks/tasks.service.ts": `
import { prisma } from "@/lib/db";
import { TaskRepository } from "./tasks.repository";
import { AuditService } from "../audit/audit.service";

export class TaskService {
  static async getTasks(type: string) {
    return await TaskRepository.getList(type);
  }

  static async createTask(title: string, desc: string, priority: string, type: string, operatorId: string | null) {
    return await prisma.$transaction(async (tx) => {
      const task = await TaskRepository.create(tx, title, desc, priority, type);
      await AuditService.log(operatorId, "create_task", { id: task.id, type });
      return task;
    });
  }

  static async updateTaskStatus(id: string, status: string, operatorId: string | null) {
    return await prisma.$transaction(async (tx) => {
      const task = await TaskRepository.updateStatus(tx, id, status);
      await AuditService.log(operatorId, "update_task_status", { id, status });
      return task;
    });
  }

  static async deleteTask(id: string, operatorId: string | null) {
    return await prisma.$transaction(async (tx) => {
      await TaskRepository.delete(tx, id);
      await AuditService.log(operatorId, "delete_task", { id });
      return true;
    });
  }
}
`,

  "events/events.repository.ts": `
import { prisma } from "@/lib/db";

export class EventRepository {
  static async getList() {
    return await prisma.event.findMany({
      where: { deletedAt: null },
      include: { participants: { include: { profile: true } } },
      orderBy: { date: "asc" },
    });
  }

  static async create(tx: any, titleUz: string, titleRu: string, date: string) {
    return await tx.event.create({
      data: { titleUz, titleRu, date, status: "kutilmoqda" },
    });
  }

  static async updateStatus(tx: any, id: string, status: string) {
    return await tx.event.update({
      where: { id },
      data: { status },
    });
  }

  static async addParticipant(tx: any, eventId: string, profileId: string) {
    return await tx.eventParticipant.create({
      data: { eventId, profileId },
    });
  }
}
`,

  "events/events.service.ts": `
import { prisma } from "@/lib/db";
import { EventRepository } from "./events.repository";
import { AuditService } from "../audit/audit.service";

export class EventService {
  static async getEvents() {
    return await EventRepository.getList();
  }

  static async createEvent(titleUz: string, titleRu: string, date: string, operatorId: string | null) {
    return await prisma.$transaction(async (tx) => {
      const event = await EventRepository.create(tx, titleUz, titleRu, date);
      await AuditService.log(operatorId, "create_event", { id: event.id, titleUz });
      return event;
    });
  }

  static async updateEventStatus(id: string, status: string, operatorId: string | null) {
    return await prisma.$transaction(async (tx) => {
      const event = await EventRepository.updateStatus(tx, id, status);
      await AuditService.log(operatorId, "update_event_status", { id, status });
      return event;
    });
  }

  static async registerParticipant(eventId: string, profileId: string, operatorId: string | null) {
    return await prisma.$transaction(async (tx) => {
      const participant = await EventRepository.addParticipant(tx, eventId, profileId);
      await AuditService.log(operatorId, "register_event_participant", { eventId, profileId });
      return participant;
    });
  }
}
`,

  "incidents/incidents.repository.ts": `
import { prisma } from "@/lib/db";

export class IncidentRepository {
  static async getList() {
    return await prisma.incident.findMany({
      where: { deletedAt: null },
      include: { profile: true },
      orderBy: { date: "desc" },
    });
  }

  static async create(tx: any, data: any) {
    return await tx.incident.create({
      data: {
        profileId: data.profileId || null,
        name: data.name,
        typeUz: data.typeUz,
        typeRu: data.typeRu,
        locationUz: data.locationUz,
        locationRu: data.locationRu,
        status: data.status || "jarayonda",
        severity: data.severity || "low",
        date: new Date().toISOString().slice(0, 16).replace("T", " "),
      },
    });
  }

  static async update(tx: any, id: string, data: any) {
    return await tx.incident.update({
      where: { id },
      data: {
        status: data.status !== undefined ? data.status : undefined,
        severity: data.severity !== undefined ? data.severity : undefined,
      },
    });
  }

  static async softDelete(tx: any, id: string) {
    return await tx.incident.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
`,

  "incidents/incidents.service.ts": `
import { prisma } from "@/lib/db";
import { IncidentRepository } from "./incidents.repository";
import { AuditService } from "../audit/audit.service";

export class IncidentService {
  static async getIncidents() {
    return await IncidentRepository.getList();
  }

  static async createIncident(data: any, operatorId: string | null) {
    return await prisma.$transaction(async (tx) => {
      const incident = await IncidentRepository.create(tx, data);
      await AuditService.log(operatorId, "create_incident", { id: incident.id, name: incident.name });
      return incident;
    });
  }

  static async updateIncident(id: string, data: any, operatorId: string | null) {
    return await prisma.$transaction(async (tx) => {
      const incident = await IncidentRepository.update(tx, id, data);
      await AuditService.log(operatorId, "update_incident", { id, status: data.status });
      return incident;
    });
  }

  static async deleteIncident(id: string, operatorId: string | null) {
    return await prisma.$transaction(async (tx) => {
      await IncidentRepository.softDelete(tx, id);
      await AuditService.log(operatorId, "delete_incident", { id });
      return true;
    });
  }
}
`,

  "appeals/appeals.repository.ts": `
import { prisma } from "@/lib/db";

export class AppealRepository {
  static async getList() {
    return await prisma.appeal.findMany({
      where: { deletedAt: null },
      include: { profile: true },
      orderBy: { date: "desc" },
    });
  }

  static async create(tx: any, data: any) {
    return await tx.appeal.create({
      data: {
        profileId: data.profileId || null,
        fullName: data.fullName,
        type: data.type,
        text: data.text,
        date: new Date().toISOString().slice(0, 16).replace("T", " "),
        status: "yangi",
        predictedCategory: data.predictedCategory || null,
      },
    });
  }

  static async updateStatus(tx: any, id: string, status: string) {
    return await tx.appeal.update({
      where: { id },
      data: { status },
    });
  }
}
`,

  "appeals/appeals.service.ts": `
import { prisma } from "@/lib/db";
import { AppealRepository } from "./appeals.repository";
import { AuditService } from "../audit/audit.service";

export class AppealService {
  static async getAppeals() {
    return await AppealRepository.getList();
  }

  static async createAppeal(data: any, operatorId: string | null) {
    return await prisma.$transaction(async (tx) => {
      const appeal = await AppealRepository.create(tx, data);
      await AuditService.log(operatorId, "create_appeal", { id: appeal.id, fullName: appeal.fullName });
      return appeal;
    });
  }

  static async updateAppealStatus(id: string, status: string, operatorId: string | null) {
    return await prisma.$transaction(async (tx) => {
      const appeal = await AppealRepository.updateStatus(tx, id, status);
      await AuditService.log(operatorId, "update_appeal_status", { id, status });
      return appeal;
    });
  }
}
`
};

for (const [relPath, content] of Object.entries(modules)) {
  const fullPath = path.join(baseDir, relPath);
  const parentDir = path.dirname(fullPath);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content.trim() + "\n", "utf8");
  console.log(`Generated: ${relPath}`);
}
console.log("All modular domains and service layers written successfully.");
