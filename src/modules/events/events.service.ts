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
