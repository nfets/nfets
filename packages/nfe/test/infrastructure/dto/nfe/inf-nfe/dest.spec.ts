import { validateSync } from 'class-validator';
import { Dest } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/dest';

describe('Dest Choice validation', () => {
  const createValidDest = (): Dest => {
    const dest = new Dest();
    dest.indIEDest = '1';
    return dest;
  };

  it('should be invalid when no Choice property is set', () => {
    const dest = createValidDest();
    const errors = validateSync(dest);
    expect(errors.length).toBe(1);
  });

  it('should be valid when only CNPJ is set', () => {
    const dest = createValidDest();
    dest.CNPJ = '12345678901234';
    const errors = validateSync(dest);
    expect(errors.length).toBe(0);
  });

  it('should be valid when only CPF is set', () => {
    const dest = createValidDest();
    dest.CPF = '12345678901';
    const errors = validateSync(dest);
    expect(errors.length).toBe(0);
  });

  it('should be invalid when both CNPJ and CPF are set', () => {
    const dest = createValidDest();
    dest.CNPJ = '12345678901234';
    dest.CPF = '12345678901';

    const errors = validateSync(dest);
    expect(errors.length).toBeGreaterThan(0);

    const cpfError = errors.find((error) => error.property === 'CPF');
    expect(cpfError).toBeDefined();
    expect(cpfError?.constraints).toBeDefined();
    expect(
      Object.values(cpfError?.constraints ?? {}).some(
        (message) =>
          typeof message === 'string' &&
          (message.includes('cannot be set because') ||
            message.includes('already set')),
      ),
    ).toBe(true);
  });
});
