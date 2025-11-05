import { MemoryCacheAdapter } from '@nfets/core/infrastructure/repositories/memory-cache-adapter';

describe('memory cache adapter (unit)', () => {
  const adapter = new MemoryCacheAdapter();

  describe('get', () => {
    it('should return null when key does not exist', async () => {
      const result = await adapter.get<string>('non-existent-key');
      expect(result).toBeNull();
    });

    it('should return cached value when key exists', async () => {
      await adapter.set('key', 'value');
      const result = await adapter.get<string>('key');
      expect(result).toBe('value');
    });

    it('should return typed value', async () => {
      const complexObject = { name: 'test', count: 42 };
      await adapter.set('complex', complexObject);
      const result = await adapter.get<typeof complexObject>('complex');
      expect(result).toEqual(complexObject);
    });
  });

  describe('has', () => {
    it('should return false when key does not exist', async () => {
      const result = await adapter.has('non-existent-key');
      expect(result).toBe(false);
    });

    it('should return true when key exists', async () => {
      await adapter.set('key', 'value');
      const result = await adapter.has('key');
      expect(result).toBe(true);
    });
  });

  describe('set', () => {
    it('should store value and return true', async () => {
      const result = await adapter.set('key', 'value');
      expect(result).toBe(true);
      const stored = await adapter.get('key');
      expect(stored).toBe('value');
    });

    it('should overwrite existing value', async () => {
      await adapter.set('key', 'value1');
      await adapter.set('key', 'value2');
      const result = await adapter.get('key');
      expect(result).toBe('value2');
    });

    it('should store complex objects', async () => {
      const complexObject = { nested: { value: 'test' } };
      await adapter.set('complex', complexObject);
      const result = await adapter.get('complex');
      expect(result).toEqual(complexObject);
    });
  });

  describe('cache isolation', () => {
    it('should store different values for different keys', async () => {
      await adapter.set('key1', 'value1');
      await adapter.set('key2', 'value2');

      const value1 = await adapter.get('key1');
      const value2 = await adapter.get('key2');

      expect(value1).toBe('value1');
      expect(value2).toBe('value2');
    });
  });
});
