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
