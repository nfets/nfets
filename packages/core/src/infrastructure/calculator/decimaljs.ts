import { Decimal as DecimalJs } from 'decimal.js';
import type {
  DecimalValue,
  Decimal as IDecimal,
} from 'src/domain/entities/calculator/decimal';

export class Decimal extends DecimalJs implements IDecimal {
  static from(value: DecimalValue): IDecimal {
    return new Decimal(value as DecimalJs.Value);
  }
}
