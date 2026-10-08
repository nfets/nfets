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

  it('should reject odd or non numeric content', () => {
    expect(() => Code128C.codes('123')).toThrow();
    expect(() => Code128C.codes('1A')).toThrow();
  });
});
