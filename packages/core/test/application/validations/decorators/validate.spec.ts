import 'reflect-metadata';
import {
  IsString,
  MinLength,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  Validates,
  ValidateErrorsMetadata,
  mapConstraintsToErrors,
} from '@nfets/core/application/validations/decorators/validate';
import {
  SkipValidation,
  SkipAllValidations,
} from '@nfets/core/application/validations/decorators/skip-validations';
import type { ValidationError } from 'class-validator';

describe('Validates decorator (unit)', () => {
  class ValidPayload {
    @IsString()
    @MinLength(3)
    public name!: string;
  }

  class InvalidPayload {
    @IsString()
    @MinLength(10)
    public name!: string;
  }

  describe('without skip validation', () => {
    class TestService {
      @Validates(ValidPayload)
      public process(payload: ValidPayload): string {
        return `Processed: ${payload.name}`;
      }
    }

    it('should validate payload and return instance', () => {
      const service = new TestService();
      const result = service.process({ name: 'Valid Name' });

      expect(result).toBe('Processed: Valid Name');
    });

    it('should collect validation errors when payload is invalid', () => {
      const service = new TestService();
      service.process({ name: 'ab' } as ValidPayload);

      const errors = Reflect.getMetadata(ValidateErrorsMetadata, service) as
        | string[]
        | undefined;
      expect(errors).toBeDefined();
      expect(errors?.length).toBeGreaterThan(0);
      expect(errors?.[0]).toContain('name');
    });

    it('should transform plain object to class instance', () => {
      const service = new TestService();
      const plainObject = { name: 'Test Name' };
      const result = service.process(plainObject as ValidPayload);

      expect(result).toBe('Processed: Test Name');
      const errors = Reflect.getMetadata(ValidateErrorsMetadata, service);
      expect(errors).toBeUndefined();
    });
  });

  describe('with SkipValidation on method', () => {
    class TestService {
      @Validates(ValidPayload)
      @SkipValidation()
      public process(payload: ValidPayload): string {
        return `Processed: ${payload.name}`;
      }
    }

    it('should skip validation when method has SkipValidation', () => {
      const service = new TestService();
      const invalidPayload = { name: 'ab' } as ValidPayload;
      const result = service.process(invalidPayload);

      expect(result).toBe('Processed: ab');
      const errors = Reflect.getMetadata(ValidateErrorsMetadata, service);
      expect(errors).toBeUndefined();
    });
  });

  describe('with SkipAllValidations on class', () => {
    @SkipAllValidations()
    class TestService {
      @Validates(InvalidPayload)
      public process(payload: InvalidPayload): string {
        return `Processed: ${payload.name}`;
      }
    }

    it('should skip validation when class has SkipAllValidations', () => {
      const service = new TestService();
      const invalidPayload = { name: 'ab' } as InvalidPayload;
      const result = service.process(invalidPayload);

      expect(result).toBe('Processed: ab');
      const errors = Reflect.getMetadata(ValidateErrorsMetadata, service);
      expect(errors).toBeUndefined();
    });
  });

  describe('with nested validation errors', () => {
    class NestedPayload {
      @IsString()
      @MinLength(5)
      public nested!: string;
    }

    class ParentPayload {
      @IsOptional()
      @ValidateNested()
      @Type(() => NestedPayload)
      public nested?: NestedPayload;
    }

    class TestService {
      @Validates(ParentPayload)
      public process(_payload: ParentPayload): string {
        return 'processed';
      }
    }

    it('should collect nested validation errors', () => {
      const service = new TestService();
      service.process({ nested: { nested: 'ab' } } as ParentPayload);

      const errors = Reflect.getMetadata(ValidateErrorsMetadata, service) as
        | string[]
        | undefined;
      expect(errors).toBeDefined();
      expect(errors?.length).toBeGreaterThan(0);
    });

    it('should collect nested validation errors with parent path', () => {
      class DeepNestedPayload {
        @IsString()
        @MinLength(5)
        public deepNested!: string;
      }

      class MiddlePayload {
        @ValidateNested()
        @Type(() => DeepNestedPayload)
        public deepNested!: DeepNestedPayload;
      }

      class TopPayload {
        @ValidateNested()
        @Type(() => MiddlePayload)
        public middle!: MiddlePayload;
      }

      class TestService {
        @Validates(TopPayload)
        public process(_payload: TopPayload): string {
          return 'processed';
        }
      }

      const service = new TestService();
      service.process({
        middle: { deepNested: { deepNested: 'ab' } },
      } as TopPayload);

      const errors = Reflect.getMetadata(ValidateErrorsMetadata, service) as
        | string[]
        | undefined;
      expect(errors).toBeDefined();
      expect(errors?.length).toBeGreaterThan(0);
      // Check that errors include parent path
      expect(errors?.some((e) => e.includes('middle.'))).toBe(true);
    });
  });

  describe('with multiple calls accumulating errors', () => {
    class TestService {
      @Validates(InvalidPayload)
      public process(payload: InvalidPayload): string {
        return `Processed: ${payload.name}`;
      }
    }

    it('should accumulate errors across multiple calls', () => {
      const service = new TestService();
      service.process({ name: 'ab' } as InvalidPayload);
      service.process({ name: 'cd' } as InvalidPayload);

      const errors = Reflect.getMetadata(ValidateErrorsMetadata, service) as
        | string[]
        | undefined;
      expect(errors).toBeDefined();
      expect(errors?.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('with additional arguments', () => {
    class TestService {
      @Validates(ValidPayload)
      public process(
        payload: ValidPayload,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...args: any[]
      ): string {
        const [extra1, extra2] = args;
        return `Processed: ${payload.name}, ${extra1}, ${extra2}`;
      }
    }

    it('should pass additional arguments correctly', () => {
      const service = new TestService();
      const result = service.process({ name: 'Test' }, 'extra', 42);

      expect(result).toBe('Processed: Test, extra, 42');
    });
  });

  describe('mapConstraintsToErrors', () => {
    it('should map errors with parent path', () => {
      const errors: ValidationError[] = [
        {
          property: 'name',
          constraints: { minLength: 'name must be longer than 3' },
        },
      ];

      const result = mapConstraintsToErrors(errors, 'parent');
      expect(result).toEqual(['parent.name must be longer than 3']);
    });

    it('should handle errors without parent path', () => {
      const errors: ValidationError[] = [
        {
          property: 'name',
          constraints: { minLength: 'name must be longer than 3' },
        },
      ];

      const result = mapConstraintsToErrors(errors);
      expect(result).toEqual(['name must be longer than 3']);
    });

    it('should handle nested children errors', () => {
      const errors: ValidationError[] = [
        {
          property: 'nested',
          children: [
            {
              property: 'value',
              constraints: { minLength: 'value must be longer than 5' },
            },
          ],
        },
      ];

      const result = mapConstraintsToErrors(errors, 'parent');
      expect(result).toEqual(['parent.nested.value must be longer than 5']);
    });

    it('should handle errors without constraints', () => {
      const errors: ValidationError[] = [
        {
          property: 'name',
        },
      ];

      const result = mapConstraintsToErrors(errors);
      expect(result).toEqual([]);
    });

    it('should handle errors with empty messages', () => {
      const errors: ValidationError[] = [
        {
          property: 'name',
          constraints: {},
        },
      ];

      const result = mapConstraintsToErrors(errors);
      expect(result).toEqual([]);
    });
  });
});
