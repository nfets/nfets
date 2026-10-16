import { Code128C } from '@nfets/nfe/application/printable-documents/nfe/builder/barcode';

describe('Code128C', () => {
  it('should encode digit pairs with start C, checksum and stop', () => {
    expect(Code128C.codes('12')).toEqual([105, 12, 14, 106]);
    expect(Code128C.codes('123456')).toEqual([105, 12, 34, 56, 44, 106]);
  });

  it('should produce 11 modules per symbol and 13 for the stop', () => {
    const key = '42261069457750000193550010000000011300843552';
    const modules = Code128C.modules(key);
    const symbols = key.length / 2 + 2;

    expect(modules.reduce((acc, module) => acc + module, 0)).toBe(
      symbols * 11 + 13,
    );
  });

  it('should reject odd digit strings and characters outside the access key', () => {
    expect(() => Code128C.codes('123')).toThrow();
    expect(() => Code128C.codes('12ab')).toThrow();
  });

  it('should encode an alphanumeric access key, keeping digit runs in subset C', () => {
    const key = '422610AB12CD34EF5699550010000012341300843559';
    const codes = Code128C.codes(key);
    const data = codes.slice(0, -2);

    expect(key).toHaveLength(44);
    expect(codes[0]).toBe(105);
    expect(codes.at(-1)).toBe(106);
    expect(Code128C.modules(key).length).toBeGreaterThan(0);
    expect(data).toEqual([
      105, 42, 26, 10, 100, 33, 34, 17, 18, 35, 36, 19, 20, 37, 38, 99, 56, 99,
      55, 0, 10, 0, 0, 12, 34, 13, 0, 84, 35, 59,
    ]);
    expect(
      data.reduce(
        (acc, symbol, index) => (index === 0 ? symbol : acc + symbol * index),
        0,
      ) % 103,
    ).toBe(codes.at(-2));
  });
});
