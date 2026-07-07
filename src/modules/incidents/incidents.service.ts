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
