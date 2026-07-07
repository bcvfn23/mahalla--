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
