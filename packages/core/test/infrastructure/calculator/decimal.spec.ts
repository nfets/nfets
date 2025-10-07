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
});
