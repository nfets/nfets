import type { CacheAdapter } from 'src/domain/repositories/cache-adapter';

export class NullCacheAdapter implements CacheAdapter {
  async get<T>(_: string): Promise<T | null> {
    return Promise.resolve(null);
  }

  has(_: string): Promise<boolean> {
    return Promise.resolve(false);
  }

  set(_: string, __: unknown): Promise<boolean> {
    return Promise.resolve(true);
  }
}
