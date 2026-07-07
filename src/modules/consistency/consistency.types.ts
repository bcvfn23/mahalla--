export interface ConsistencyReport {
  score: number;
  inconsistencies: Array<{
    module: string;
    expected: any;
    actual: any;
    severity: "low" | "medium" | "critical";
  }>;
}
