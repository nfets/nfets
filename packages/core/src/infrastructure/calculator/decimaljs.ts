import { Decimal as DecimalJs } from 'decimal.js';
import type {
  DecimalValue,
  Decimal as IDecimal,
} from '@nfets/core/domain/entities/calculator/decimal';

export class Decimal extends DecimalJs implements IDecimal {
  static from(value: DecimalValue): IDecimal {
    return new Decimal(value as DecimalJs.Value);
  }

  static newOrZero(value?: DecimalValue): IDecimal {
    if (value === void 0) return Decimal.from(0);
    return Decimal.from(value);
  }

  static newOrUndefined(value?: DecimalValue): IDecimal | undefined {
    if (value === void 0) return void 0;
    return Decimal.from(value);
  }
}
