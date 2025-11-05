type DecimalRounding = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type DecimalValue = string | number | bigint;

export interface Decimal {
  d: number[];
  e: number;
  s: number;

  abs(): Decimal;

  ceil(): Decimal;

  comparedTo(n: DecimalValue | Decimal): number;
  cmp(n: DecimalValue | Decimal): number;

  decimalPlaces(): number;
  dp(): number;

  div(n: DecimalValue | Decimal): Decimal;

  divToInt(n: DecimalValue | Decimal): Decimal;

  equals(n: DecimalValue | Decimal): boolean;

  floor(): Decimal;

  greaterThan(n: DecimalValue | Decimal): boolean;
  gt(n: DecimalValue | Decimal): boolean;

  greaterThanOrEqualTo(n: DecimalValue | Decimal): boolean;
  gte(n: DecimalValue | Decimal): boolean;

  isFinite(): boolean;

  isInteger(): boolean;
  isInt(): boolean;

  isNaN(): boolean;

  isNegative(): boolean;

  isPositive(): boolean;

  isZero(): boolean;

  lessThan(n: DecimalValue | Decimal): boolean;
  lt(n: DecimalValue | Decimal): boolean;

  lessThanOrEqualTo(n: DecimalValue | Decimal): boolean;
  lte(n: DecimalValue | Decimal): boolean;

  sub(n: DecimalValue | Decimal): Decimal;

  mod(n: DecimalValue | Decimal): Decimal;

  naturalExponential(): Decimal;
  exp(): Decimal;

  negated(): Decimal;
  neg(): Decimal;

  add(n: DecimalValue | Decimal): Decimal;

  precision(includeZeros?: boolean): number;
  sd(includeZeros?: boolean): number;

  round(): Decimal;

  sqrt(): Decimal;

  times(n: DecimalValue | Decimal): Decimal;
  mul(n: DecimalValue | Decimal): Decimal;

  toExponential(decimalPlaces?: number, rounding?: DecimalRounding): string;
  toExponential(decimalPlaces: number, rounding: DecimalRounding): string;

  toFixed(decimalPlaces?: number, rounding?: DecimalRounding): string;
  toFixed(decimalPlaces: number, rounding: DecimalRounding): string;

  toFraction(max_denominator?: DecimalValue | Decimal): Decimal[];

  toJSON(): string;

  toNumber(): number;

  pow(n: DecimalValue | Decimal): Decimal;

  toPrecision(significantDigits?: number, rounding?: DecimalRounding): string;

  toDecimalPlaces(decimalPlaces?: number, rounding?: DecimalRounding): Decimal;

  toString(): string;

  trunc(): Decimal;

  valueOf(): string;
}
