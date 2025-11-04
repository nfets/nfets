import { validateSync } from 'class-validator';
import { AutXML } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/autxml';

describe('AutXML Choice validation', () => {
  it('should be valid when no Choice property is set', () => {
    const autXML = new AutXML();
    const errors = validateSync(autXML);
    expect(errors.length).toBe(0);
  });

  it('should be valid when only CNPJ is set', () => {
    const autXML = new AutXML();
    autXML.CNPJ = '12345678901234';
    const errors = validateSync(autXML);
    expect(errors.length).toBe(0);
  });

  it('should be valid when only CPF is set', () => {
    const autXML = new AutXML();
    autXML.CPF = '12345678901';
    const errors = validateSync(autXML);
    expect(errors.length).toBe(0);
  });

  it('should be invalid when both CNPJ and CPF are set', () => {
    const autXML = new AutXML();
    autXML.CNPJ = '12345678901234';
    autXML.CPF = '12345678901';

    const errors = validateSync(autXML);
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
