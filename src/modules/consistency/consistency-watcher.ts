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
