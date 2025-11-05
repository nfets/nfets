import 'reflect-metadata';
import { validate } from 'class-validator';
import { IsOptional } from 'class-validator';
import { IsDecimal } from '@nfets/core/application/validations/decorators/decimal';
import { Decimal } from '@nfets/core/infrastructure/calculator/decimaljs';

describe('IsDecimal decorator (unit)', () => {
  describe('with valid values', () => {
    class TestClass {
      @IsOptional()
      @IsDecimal()
      public value?: string | number | bigint | Decimal;
    }

    it('should pass validation when value is a Decimal instance', async () => {
      const instance = new TestClass();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (instance as any).value = Decimal.from(100.5);

      const errors = await validate(instance);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation when value is a string', async () => {
      const instance = new TestClass();
      instance.value = '123.45';

      const errors = await validate(instance);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation when value is a number', async () => {
      const instance = new TestClass();
      instance.value = 123.45;

      const errors = await validate(instance);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation when value is a bigint', async () => {
      const instance = new TestClass();
      instance.value = BigInt(123);

      const errors = await validate(instance);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation when value is undefined', async () => {
      const instance = new TestClass();

      const errors = await validate(instance);
      expect(errors).toHaveLength(0);
    });
  });

  describe('with invalid values', () => {
    class TestClass {
      @IsDecimal()
      public value!: unknown;
    }

    it('should fail validation when value is an object', async () => {
      const instance = new TestClass();
      instance.value = {};

      const errors = await validate(instance);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isDecimal).toBeDefined();
    });

    it('should fail validation when value is an array', async () => {
      const instance = new TestClass();
      instance.value = [];

      const errors = await validate(instance);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isDecimal).toBeDefined();
    });

    it('should fail validation when value is boolean', async () => {
      const instance = new TestClass();
      instance.value = true;

      const errors = await validate(instance);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isDecimal).toBeDefined();
    });

    it('should fail validation when value is null', async () => {
      const instance = new TestClass();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (instance as any).value = null;

      const errors = await validate(instance);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isDecimal).toBeDefined();
    });
  });

  describe('with custom message', () => {
    class TestClass {
      @IsDecimal({ message: 'Custom error message' })
      public value!: unknown;
    }

    it('should use custom message when validation fails', async () => {
      const instance = new TestClass();
      instance.value = {};

      const errors = await validate(instance);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints?.isDecimal).toContain(
        'Custom error message',
      );
    });
  });
});
