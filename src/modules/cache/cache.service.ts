import { ConfigService } from "../config/config.service";

export class CacheService {
  private static store = new Map<string, { value: any; expiresAt: number }>();

  static get<T>(key: string): T | null {
    const item = this.store.get(key);
    if (!item) return null;
    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value as T;
  }

  static set(key: string, value: any, ttlMs: number = ConfigService.cache.defaultTtlMs): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  static invalidate(key: string): void {
    this.store.delete(key);
  }

  static invalidateAll(): void {
    this.store.clear();
  }
}
