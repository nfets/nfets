import type { CacheAdapter } from '@nfets/core/domain/repositories/cache-adapter';

export class MemoryCacheAdapter implements CacheAdapter {
  private cache = new Map<string, unknown>();

  async get<T>(key: string): Promise<T | null> {
    return Promise.resolve((this.cache.get(key) ?? null) as T);
  }

  has(key: string): Promise<boolean> {
    return Promise.resolve(this.cache.has(key));
  }

  set(key: string, value: unknown): Promise<boolean> {
    this.cache.set(key, value);
    return Promise.resolve(true);
  }
}
