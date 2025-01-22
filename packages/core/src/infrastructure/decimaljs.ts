import { Decimal as DecimalJs } from 'decimal.js';
import type { Decimal as IDecimal } from 'src/domain/entities/decimal';

export class Decimal extends DecimalJs implements IDecimal {}
