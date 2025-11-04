import 'reflect-metadata';
import { validate } from 'class-validator';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Choice } from '@nfets/core/application/validations/decorators/choice';

describe('Choice decorator', () => {
  describe('single group - required', () => {
    @Choice({ properties: ['CPF', 'CNPJ'], required: true })
    class Person {
      @IsOptional()
      @IsString()
      public CPF?: string;

      @IsOptional()
      @IsString()
      public CNPJ?: string;
    }

    it('should pass validation when CPF is provided', async () => {
      const person = new Person();
      person.CPF = '12345678901';

      const errors = await validate(person);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation when CNPJ is provided', async () => {
      const person = new Person();
      person.CNPJ = '12345678000190';

      const errors = await validate(person);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when both CPF and CNPJ are provided', async () => {
      const person = new Person();
      person.CPF = '12345678901';
      person.CNPJ = '12345678000190';

      const errors = await validate(person);
      expect(errors.length).toBeGreaterThan(0);
      const cnpjError = errors.find((e) => e.property === 'CNPJ');
      expect(cnpjError).toBeDefined();
      expect(cnpjError?.constraints?.choice).toContain(
        'cannot be set because CPF is already set',
      );
    });
  });

  describe('single group - optional', () => {
    @Choice({ properties: ['veicProd', 'med', 'arma'] })
    class Product {
      @IsOptional()
      @IsString()
      public veicProd?: string;

      @IsOptional()
      @IsString()
      public med?: string;

      @IsOptional()
      @IsString()
      public arma?: string;
    }

    it('should pass validation when no property is provided', async () => {
      const product = new Product();

      const errors = await validate(product);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation when one property is provided', async () => {
      const product = new Product();
      product.veicProd = 'vehicle';

      const errors = await validate(product);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when multiple properties are provided', async () => {
      const product = new Product();
      product.veicProd = 'vehicle';
      product.med = 'medicine';

      const errors = await validate(product);
      expect(errors.length).toBeGreaterThan(0);
      const medError = errors.find((e) => e.property === 'med');
      expect(medError).toBeDefined();
      expect(medError?.constraints?.choice).toContain(
        'cannot be set because veicProd is already set',
      );
    });
  });

  describe('multiple groups', () => {
    @Choice({ properties: ['veicTransp', 'reboque'] })
    @Choice({ properties: ['vagao', 'balsa'] })
    class Transport {
      @IsOptional()
      @IsString()
      public veicTransp?: string;

      @IsOptional()
      @IsString()
      public reboque?: string;

      @IsOptional()
      @IsString()
      public vagao?: string;

      @IsOptional()
      @IsString()
      public balsa?: string;
    }

    it('should pass validation when one property from first group is provided', async () => {
      const transport = new Transport();
      transport.veicTransp = 'vehicle';

      const errors = await validate(transport);
      expect(errors).toHaveLength(0);
    });

    it('should pass validation when one property from second group is provided', async () => {
      const transport = new Transport();
      transport.vagao = 'wagon';

      const errors = await validate(transport);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation when properties from different groups are provided', async () => {
      const transport = new Transport();
      transport.veicTransp = 'vehicle';
      transport.vagao = 'wagon';

      const errors = await validate(transport);
      expect(errors.length).toBeGreaterThan(0);
      const vagaoError = errors.find((e) => e.property === 'vagao');
      expect(vagaoError).toBeDefined();
      expect(vagaoError?.constraints?.choice).toContain(
        'cannot be set because veicTransp from a different choice group is already set',
      );
    });

    it('should fail validation when multiple properties from same group are provided', async () => {
      const transport = new Transport();
      transport.veicTransp = 'vehicle';
      transport.reboque = 'trailer';

      const errors = await validate(transport);
      expect(errors.length).toBeGreaterThan(0);
      const reboqueError = errors.find((e) => e.property === 'reboque');
      expect(reboqueError).toBeDefined();
      expect(reboqueError?.constraints?.choice).toContain(
        'cannot be set because veicTransp is already set',
      );
    });
  });

  describe('nested objects', () => {
    class NestedObject {
      @IsString()
      public value!: string;
    }

    @Choice({ properties: ['obj1', 'obj2'], required: true })
    class Container {
      @IsOptional()
      @ValidateNested()
      @Type(() => NestedObject)
      public obj1?: NestedObject;

      @IsOptional()
      @ValidateNested()
      @Type(() => NestedObject)
      public obj2?: NestedObject;
    }

    it('should pass validation when obj1 is provided', async () => {
      const container = new Container();
      container.obj1 = new NestedObject();
      container.obj1.value = 'test';

      const errors = await validate(container);
      expect(errors).toHaveLength(0);
    });
  });

  describe('edge cases', () => {
    @Choice({ properties: ['prop1', 'prop2'] })
    class EdgeCase {
      @IsOptional()
      @IsString()
      public prop1?: string;

      @IsOptional()
      @IsString()
      public prop2?: string;
    }

    it('should handle null values correctly', async () => {
      const instance = new EdgeCase();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (instance as any).prop1 = null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (instance as any).prop2 = null;

      const errors = await validate(instance);
      expect(errors).toHaveLength(0);
    });

    it('should handle undefined values correctly', async () => {
      const instance = new EdgeCase();
      instance.prop1 = undefined;
      instance.prop2 = undefined;

      const errors = await validate(instance);
      expect(errors).toHaveLength(0);
    });
  });
});
