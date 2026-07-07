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
