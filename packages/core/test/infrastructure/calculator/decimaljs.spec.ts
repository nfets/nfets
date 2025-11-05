import { Decimal } from '@nfets/core/infrastructure/calculator/decimaljs';

describe('decimal (unit)', () => {
  // https://0.30000000000000004.com 🤡🤡🐞🐞
  it("shouldn't have floating point problem", () => {
    expect(0.1 + 0.2).toStrictEqual(0.30000000000000004);
    expect(Decimal.from(0.1).add(0.2).toNumber()).toStrictEqual(0.3);
  });

  it('should truncate at provided decimal place', () => {
    expect(Decimal.from(4123.325241245342).toNumber()).toStrictEqual(
      4123.325241245342,
    );
    expect(
      Decimal.from(21312.2321312259).toDecimalPlaces(8).toNumber(),
    ).toStrictEqual(21312.23213123);

    expect(Decimal.from(0.57344823).toNumber()).toStrictEqual(0.57344823);
    expect(
      Decimal.from(0.57344823).toDecimalPlaces(4).toNumber(),
    ).toStrictEqual(0.5734);

    expect(
      Decimal.from('543765.325485723189')
        .times(0.57344823)
        .toDecimalPlaces(2)
        .toNumber(),
    ).toStrictEqual(311821.26);
  });

  describe('newOrZero', () => {
    it('should return zero when value is undefined', () => {
      const result = Decimal.newOrZero(undefined);
      expect(result.toNumber()).toBe(0);
    });

    it('should return Decimal from value when value is provided', () => {
      const result = Decimal.newOrZero(123.45);
      expect(result.toNumber()).toBe(123.45);
    });

    it('should return Decimal from string value', () => {
      const result = Decimal.newOrZero('123.45');
      expect(result.toNumber()).toBe(123.45);
    });

    it('should return Decimal from bigint value', () => {
      const result = Decimal.newOrZero(BigInt(123));
      expect(result.toNumber()).toBe(123);
    });
  });

  describe('newOrUndefined', () => {
    it('should return undefined when value is undefined', () => {
      const result = Decimal.newOrUndefined(undefined);
      expect(result).toBeUndefined();
    });

    it('should return Decimal from value when value is provided', () => {
      const result = Decimal.newOrUndefined(123.45);
      expect(result).toBeDefined();
      expect(result?.toNumber()).toBe(123.45);
    });

    it('should return Decimal from string value', () => {
      const result = Decimal.newOrUndefined('123.45');
      expect(result).toBeDefined();
      expect(result?.toNumber()).toBe(123.45);
    });

    it('should return Decimal from bigint value', () => {
      const result = Decimal.newOrUndefined(BigInt(123));
      expect(result).toBeDefined();
      expect(result?.toNumber()).toBe(123);
    });
  });
});
