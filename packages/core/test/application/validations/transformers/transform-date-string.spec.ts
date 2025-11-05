import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { TransformDateString } from '@nfets/core/application/validations/transformers/transform-date-string';

describe('TransformDateString decorator (unit)', () => {
  describe('with default format', () => {
    class TestClass {
      @TransformDateString()
      public date?: Date | string;
    }

    it('should transform Date object to ISO string formatted', () => {
      const date = new Date('2025-01-15T10:30:00Z');
      const instance = plainToInstance(TestClass, { date });

      expect(instance.date).toBeDefined();
      expect(typeof instance.date).toBe('string');
      expect(instance.date).toMatch(/2025-01-15/);
    });

    it('should transform string date to formatted string', () => {
      const instance = plainToInstance(TestClass, {
        date: '2025-01-15T10:30:00Z',
      });

      expect(instance.date).toBeDefined();
      expect(typeof instance.date).toBe('string');
      expect(instance.date).toMatch(/2025-01-15/);
    });

    it('should handle undefined value', () => {
      const instance = plainToInstance(TestClass, { date: undefined });

      expect(instance.date).toBeUndefined();
    });
  });

  describe('with custom format', () => {
    class TestClass {
      @TransformDateString({ format: 'YYYY-MM-DD' })
      public date?: Date | string;
    }

    it('should transform Date to custom format', () => {
      const date = new Date('2025-01-15T10:30:00Z');
      const instance = plainToInstance(TestClass, { date });

      expect(instance.date).toBe('2025-01-15');
    });

    it('should transform string date to custom format', () => {
      const instance = plainToInstance(TestClass, {
        date: '2025-01-15T10:30:00Z',
      });

      expect(instance.date).toBe('2025-01-15');
    });
  });

  describe('with validation options', () => {
    class TestClass {
      @TransformDateString({ format: 'YYYY-MM-DD', message: 'Invalid date' })
      public date?: Date | string;
    }

    it('should apply validation options', () => {
      const date = new Date('2025-01-15T10:30:00Z');
      const instance = plainToInstance(TestClass, { date });

      expect(instance.date).toBe('2025-01-15');
    });
  });

  describe('with invalid date string', () => {
    class TestClass {
      @TransformDateString({ format: 'YYYY-MM-DD' })
      public date?: Date | string;
    }

    it('should handle invalid date string', () => {
      const instance = plainToInstance(TestClass, {
        date: 'invalid-date',
      });

      expect(instance.date).toBeDefined();
    });
  });
});
