import 'reflect-metadata';
import { plainToInstance } from '@nfets/core/application/validations/transformers/plain-to-instance';
import { Type } from 'class-transformer';

describe('plainToInstance transformer (unit)', () => {
  class TestClass {
    public name!: string;
    public age!: number;
    public optional?: string;
  }

  describe('with valid plain object', () => {
    it('should transform plain object to class instance', () => {
      const plain = { name: 'John', age: 30 };
      const instance = plainToInstance(plain, TestClass);

      expect(instance).toBeInstanceOf(TestClass);
      expect(instance.name).toBe('John');
      expect(instance.age).toBe(30);
    });

    it('should handle optional properties', () => {
      const plain = { name: 'John', age: 30, optional: 'test' };
      const instance = plainToInstance(plain, TestClass);

      expect(instance.optional).toBe('test');
    });
  });

  describe('with undefined values', () => {
    it('should remove undefined values from instance', () => {
      const plain = { name: 'John', age: 30, optional: undefined };
      const instance = plainToInstance(plain, TestClass, {
        clearEmptyValues: true,
      });

      expect(instance.name).toBe('John');
      expect(instance.age).toBe(30);
      expect('optional' in instance).toBe(false);
    });

    it('should remove nested undefined values', () => {
      class NestedClass {
        public value!: string;
        public nested?: { prop?: string };
      }

      const plain = {
        value: 'test',
        nested: { prop: undefined },
      };
      const instance = plainToInstance(plain, NestedClass, {
        clearEmptyValues: true,
      });

      expect(instance.value).toBe('test');
      expect(instance.nested).toBeDefined();
      expect('prop' in (instance.nested ?? {})).toBe(false);
    });
  });

  describe('with nested objects', () => {
    class NestedClass {
      public value!: string;
    }

    class ParentClass {
      public name!: string;
      @Type(() => NestedClass)
      public nested!: NestedClass;
    }

    it('should transform nested objects', () => {
      const plain = {
        name: 'John',
        nested: { value: 'nested' },
      };
      const instance = plainToInstance(plain, ParentClass);

      expect(instance.name).toBe('John');
      expect(instance.nested).toBeInstanceOf(NestedClass);
      expect(instance.nested.value).toBe('nested');
    });

    it('should remove undefined values from nested objects', () => {
      const plain = {
        name: 'John',
        nested: { value: 'test', optional: undefined },
      };
      const instance = plainToInstance(plain, ParentClass, {
        clearEmptyValues: true,
      });

      expect(instance.nested).toBeInstanceOf(NestedClass);
      expect(instance.nested.value).toBe('test');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect('optional' in (instance.nested as any)).toBe(false);
    });
  });

  describe('with deeply nested undefined values', () => {
    class DeepNestedClass {
      public level1?: {
        level2?: {
          level3?: string;
        };
      };
    }

    it('should recursively remove undefined values', () => {
      const plain = {
        level1: {
          level2: {
            level3: undefined,
          },
        },
      };
      const instance = plainToInstance(plain, DeepNestedClass, {
        clearEmptyValues: true,
      });

      expect(instance.level1).toBeDefined();
      expect(instance.level1?.level2).toBeDefined();
      // Note: plainToInstance doesn't recursively transform plain objects without @Type decorator
      // So level1 and level2 remain as plain objects, but undefined values are still removed
      expect('level3' in (instance.level1?.level2 ?? {})).toBe(false);
    });
  });
});
