import 'reflect-metadata';
import { Decimal, type DecimalValue } from '@nfets/core';

import {
  registerDecorator,
  type ValidationOptions,
  type ValidationArguments,
} from 'class-validator';
import { Transform } from 'class-transformer';

export interface TransformDecimalArgs extends ValidationOptions {
  fixed?: number;
}

export const TransformDecimal = (
  { fixed, ...args }: TransformDecimalArgs = { fixed: 2 },
): PropertyDecorator => {
  return (target: object, propertyKey: string | symbol) => {
    IsDecimal(args)(target, propertyKey);
    Transform(({ value }: { value: DecimalValue }) =>
      Decimal.newOrUndefined(value)?.toFixed(fixed),
    )(target, propertyKey);
  };
};

export const IsDecimal = (
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return (target: object, propertyKey: string | symbol) => {
    registerDecorator({
      name: 'isDecimal',
      target: target.constructor,
      propertyName: propertyKey as string,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (value instanceof Decimal) return true;
          return (
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'bigint'
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} is not a valid Decimal value`;
        },
      },
    });
  };
};
