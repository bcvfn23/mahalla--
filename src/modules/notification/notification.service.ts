export class NotificationService {
  static async sendSystemAlert(message: string, type: "info" | "warning" | "error" = "info") {
    console.log(`[Notification Service] [${type.toUpperCase()}]: ${message}`);
  }
}
