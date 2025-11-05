import { NullCacheAdapter } from '@nfets/core/infrastructure/repositories/null-cache-adapter';

describe('null cache adapter (unit)', () => {
  const adapter = new NullCacheAdapter();

  describe('get', () => {
    it('should always return null', async () => {
      const result = await adapter.get<string>('any-key');
      expect(result).toBeNull();
    });

    it('should return null for any key', async () => {
      const result1 = await adapter.get('key1');
      const result2 = await adapter.get('key2');

      expect(result1).toBeNull();
      expect(result2).toBeNull();
    });
  });

  describe('has', () => {
    it('should always return false', async () => {
      const result = await adapter.has('any-key');
      expect(result).toBe(false);
    });

    it('should return false even after setting a value', async () => {
      await adapter.set('key', 'value');
      const result = await adapter.has('key');
      expect(result).toBe(false);
    });
  });

  describe('set', () => {
    it('should always return true', async () => {
      const result = await adapter.set('key', 'value');
      expect(result).toBe(true);
    });

    it('should return true for any key-value pair', async () => {
      const result1 = await adapter.set('key1', 'value1');
      const result2 = await adapter.set('key2', { complex: 'object' });

      expect(result1).toBe(true);
      expect(result2).toBe(true);
    });

    it('should not store values', async () => {
      await adapter.set('key', 'value');
      const result = await adapter.get('key');
      expect(result).toBeNull();
    });
  });
});
