import 'reflect-metadata';
import { Decimal } from '@nfets/core/infrastructure';

import {
  registerDecorator,
  type ValidationOptions,
  type ValidationArguments,
} from 'class-validator';

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
