import { ConsistencyChecker } from "./consistency-checker";
import { ConsistencyReport } from "./consistency.types";

export class ConsistencyReporter {
  static async getReport(): Promise<ConsistencyReport> {
    return await ConsistencyChecker.check();
  }
}
