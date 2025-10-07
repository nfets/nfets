import 'reflect-metadata';
import { Decimal } from '@nfets/core';
import type { DecimalValue } from '@nfets/core';
import type { ValidationOptions } from 'class-validator';

import { Transform } from 'class-transformer';
import { IsDecimal } from '../validator/decimal';

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
