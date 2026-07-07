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
