import 'reflect-metadata';
import {
  SkipValidation,
  SkipAllValidations,
} from '@nfets/core/application/validations/decorators/skip-validations';
import { SkipValidationMetadata } from '@nfets/core/application/validations/decorators/skip-validations';

describe('SkipValidation decorators (unit)', () => {
  describe('SkipValidation method decorator', () => {
    class TestClass {
      public method1(): string {
        return 'method1';
      }

      @SkipValidation()
      public method2(): string {
        return 'method2';
      }
    }

    it('should add metadata to the method', () => {
      const metadata = Reflect.getMetadata(
        SkipValidationMetadata,
        TestClass.prototype,
        'method2',
      );

      expect(metadata).toBe(true);
    });

    it('should not add metadata to methods without decorator', () => {
      const metadata = Reflect.getMetadata(
        SkipValidationMetadata,
        TestClass.prototype,
        'method1',
      );

      expect(metadata).toBeUndefined();
    });
  });

  describe('SkipAllValidations class decorator', () => {
    @SkipAllValidations()
    class TestClass {
      public method1(): string {
        return 'method1';
      }

      public method2(): string {
        return 'method2';
      }
    }

    it('should add metadata to the class', () => {
      const metadata = Reflect.getMetadata(SkipValidationMetadata, TestClass);

      expect(metadata).toBe(true);
    });
  });

  describe('combined usage', () => {
    @SkipAllValidations()
    class TestClass {
      public method1(): string {
        return 'method1';
      }

      @SkipValidation()
      public method2(): string {
        return 'method2';
      }
    }

    it('should have both class and method metadata', () => {
      const classMetadata = Reflect.getMetadata(
        SkipValidationMetadata,
        TestClass,
      );
      const methodMetadata = Reflect.getMetadata(
        SkipValidationMetadata,
        TestClass.prototype,
        'method2',
      );

      expect(classMetadata).toBe(true);
      expect(methodMetadata).toBe(true);
    });
  });
});
