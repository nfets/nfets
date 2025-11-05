import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { TransformDecimal } from '@nfets/core/application/validations/transformers/decimal';
import { Decimal } from '@nfets/core/infrastructure/calculator/decimaljs';

describe('TransformDecimal decorator (unit)', () => {
  describe('with default fixed value', () => {
    class TestClass {
      @TransformDecimal()
      public value?: string | number | bigint | Decimal;
    }

    it('should transform Decimal instance to fixed string', () => {
      const instance = plainToInstance(TestClass, {
        value: 123.456789,
      });

      expect(instance.value).toBe('123.46');
    });

    it('should transform string to fixed string', () => {
      const instance = plainToInstance(TestClass, {
        value: '123.456789',
      });

      expect(instance.value).toBe('123.46');
    });

    it('should transform number to fixed string', () => {
      const instance = plainToInstance(TestClass, {
        value: 123.456789,
      });

      expect(instance.value).toBe('123.46');
    });

    it('should handle undefined value', () => {
      const instance = plainToInstance(TestClass, {
        value: undefined,
      });

      expect(instance.value).toBeUndefined();
    });

    it('should handle bigint value', () => {
      const instance = plainToInstance(TestClass, {
        value: BigInt(123),
      });

      expect(instance.value).toBe('123.00');
    });
  });

  describe('with custom fixed value', () => {
    class TestClass {
      @TransformDecimal({ fixed: 4 })
      public value?: string | number | Decimal;
    }

    it('should transform to fixed string with custom decimal places', () => {
      const instance = plainToInstance(TestClass, {
        value: 123.456789,
      });

      expect(instance.value).toBe('123.4568');
    });
  });

  describe('with validation options', () => {
    class TestClass {
      @TransformDecimal({ fixed: 2, message: 'Custom error' })
      public value?: string | number | Decimal;
    }

    it('should apply validation options', () => {
      const instance = plainToInstance(TestClass, {
        value: 123.45,
      });

      expect(instance.value).toBe('123.45');
    });
  });
});
