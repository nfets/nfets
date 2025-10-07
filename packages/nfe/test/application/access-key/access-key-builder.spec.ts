import { AccessKeyBuider } from '@nfets/nfe/application/access-key/access-key-builder';

describe('access key builder (unit)', () => {
  const accessKeyBuilder = new AccessKeyBuider();

  it('should compile a valid access key with pads when using number arguments', () => {
    const accessKey = accessKeyBuilder.compile({
      cUF: 42,
      year: 25,
      month: 1,
      identification: '50181930000167',
      mod: '55',
      serie: 1,
      nNF: 12312,
      tpEmis: 1,
      cNF: 12837181,
    });

    expect(accessKey).toStrictEqual(
      '42250150181930000167550010000123121128371816',
    );
  });

  it('should compile a valid access key with all valid arguments', () => {
    const accessKey = accessKeyBuilder.compile({
      cUF: '42',
      year: '25',
      month: '01',
      identification: '50181930000167',
      mod: '55',
      serie: '001',
      nNF: '000012312',
      tpEmis: '1',
      cNF: '12837181',
    });

    expect(accessKey).toStrictEqual(
      '42250150181930000167550010000123121128371816',
    );
  });

  it('should compile a valid access key with random generated code', () => {
    const accessKey = accessKeyBuilder.compile({
      cUF: '42',
      year: '25',
      month: '01',
      identification: '50181930000167',
      mod: '55',
      serie: '001',
      nNF: '000012312',
      tpEmis: '1',
      cNF: undefined,
    });

    expect(accessKey.length).toBe(44);
    expect(accessKey.substring(0, 44 - 9)).toStrictEqual(
      '42250150181930000167550010000123121',
    );
  });

  it('should compile a valid access key with random generated code which vd results greather than 9', () => {
    const accessKey = accessKeyBuilder.compile({
      cUF: '42',
      year: '25',
      month: '01',
      identification: '50181930000167',
      mod: '55',
      serie: '001',
      nNF: '000012312',
      tpEmis: '1',
      cNF: '12312321',
    });

    expect(accessKey.length).toBe(44);
    expect(accessKey.substring(0, 44 - 9)).toStrictEqual(
      '42250150181930000167550010000123121',
    );
  });

  it('should decompile a valid string access key to object', () => {
    const accessKey = accessKeyBuilder.decompile(
      '42250150181930000167550010000123121128371816',
    );

    expect(accessKey).toStrictEqual({
      cUF: '42',
      year: '25',
      month: '01',
      identification: '50181930000167',
      mod: '55',
      serie: '001',
      nNF: '000012312',
      tpEmis: '1',
      cNF: '12837181',
      vd: '6',
    });
  });

  it('should decompile an invalid string access key length to undefined', () => {
    const accessKey = accessKeyBuilder.decompile('not a 44 string length');
    expect(accessKey).toBeUndefined();
  });

  it('should decompile an invalid string access key content to undefined', () => {
    const accessKey = accessKeyBuilder.decompile(
      'a 44 string length but without regex match..',
    );
    expect(accessKey).toBeUndefined();
  });

  it('should compile a valid string access key falling back to another code generation when generated code is invalid', () => {
    const originalMathRandom = Math.random;

    let calls = 0;
    jest.spyOn(Math, 'random').mockImplementation(() => {
      if (calls === 1) return originalMathRandom();
      calls++;
      return 0;
    });

    const accessKey = accessKeyBuilder.compile({
      cUF: '42',
      year: '25',
      month: '01',
      identification: '50181930000167',
      mod: '55',
      serie: '001',
      nNF: '000012312',
      tpEmis: '1',
    });

    expect(accessKey.substring(0, 44 - 9)).toStrictEqual(
      '42250150181930000167550010000123121',
    );
  });
});
