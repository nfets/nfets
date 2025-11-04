import { validateSync } from 'class-validator';
import { Transporta } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/transp/transporta';

describe('Transporta SwitchCase validation', () => {
  it('should be valid when no SwitchCase property is set', () => {
    const transporta = new Transporta();
    const errors = validateSync(transporta);
    expect(errors.length).toBe(0);
  });

  it('should be valid when only CNPJ is set', () => {
    const transporta = new Transporta();
    transporta.CNPJ = '12345678901234';
    const errors = validateSync(transporta);
    expect(errors.length).toBe(0);
  });

  it('should be valid when only CPF is set', () => {
    const transporta = new Transporta();
    transporta.CPF = '12345678901';
    const errors = validateSync(transporta);
    expect(errors.length).toBe(0);
  });

  it('should be invalid when both CNPJ and CPF are set', () => {
    const transporta = new Transporta();
    transporta.CNPJ = '12345678901234';
    transporta.CPF = '12345678901';

    const errors = validateSync(transporta);
    expect(errors.length).toBeGreaterThan(0);

    const cpfError = errors.find((error) => error.property === 'CPF');
    expect(cpfError).toBeDefined();
    expect(cpfError?.constraints).toBeDefined();
    expect(
      Object.values(cpfError?.constraints ?? {}).some(
        (message) =>
          typeof message === 'string' && message.includes('already setted'),
      ),
    ).toBe(true);
  });
});
