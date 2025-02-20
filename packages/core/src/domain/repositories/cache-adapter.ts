export interface CacheAdapter {
  get<T>(key: string): Promise<T | null>;
  has(key: string): Promise<boolean>;
  set(key: string, value: unknown): Promise<boolean>;
}
