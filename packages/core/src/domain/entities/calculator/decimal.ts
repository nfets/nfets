type DecimalRounding = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type DecimalValue = string | number | bigint | Decimal;

export interface Decimal {
  d: number[];
  e: number;
  s: number;

  abs(): Decimal;

  ceil(): Decimal;

  comparedTo(n: DecimalValue): number;
  cmp(n: DecimalValue): number;

  decimalPlaces(): number;
  dp(): number;

  div(n: DecimalValue): Decimal;

  divToInt(n: DecimalValue): Decimal;

  equals(n: DecimalValue): boolean;

  floor(): Decimal;

  greaterThan(n: DecimalValue): boolean;
  gt(n: DecimalValue): boolean;

  greaterThanOrEqualTo(n: DecimalValue): boolean;
  gte(n: DecimalValue): boolean;

  isFinite(): boolean;

  isInteger(): boolean;
  isInt(): boolean;

  isNaN(): boolean;

  isNegative(): boolean;

  isPositive(): boolean;

  isZero(): boolean;

  lessThan(n: DecimalValue): boolean;
  lt(n: DecimalValue): boolean;

  lessThanOrEqualTo(n: DecimalValue): boolean;
  lte(n: DecimalValue): boolean;

  sub(n: DecimalValue): Decimal;

  mod(n: DecimalValue): Decimal;

  naturalExponential(): Decimal;
  exp(): Decimal;

  negated(): Decimal;
  neg(): Decimal;

  add(n: DecimalValue): Decimal;

  precision(includeZeros?: boolean): number;
  sd(includeZeros?: boolean): number;

  round(): Decimal;

  sqrt(): Decimal;

  times(n: DecimalValue): Decimal;
  mul(n: DecimalValue): Decimal;

  toExponential(decimalPlaces?: number, rounding?: DecimalRounding): string;
  toExponential(decimalPlaces: number, rounding: DecimalRounding): string;

  toFixed(decimalPlaces?: number, rounding?: DecimalRounding): string;
  toFixed(decimalPlaces: number, rounding: DecimalRounding): string;

  toFraction(max_denominator?: DecimalValue): Decimal[];

  toJSON(): string;

  toNumber(): number;

  pow(n: DecimalValue): Decimal;

  toPrecision(significantDigits?: number, rounding?: DecimalRounding): string;

  toDecimalPlaces(decimalPlaces?: number, rounding?: DecimalRounding): Decimal;

  toString(): string;

  trunc(): Decimal;

  valueOf(): string;
}
