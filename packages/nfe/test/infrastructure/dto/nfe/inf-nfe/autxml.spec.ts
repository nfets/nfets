import { validateSync } from 'class-validator';
import { AutXML } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/autxml';

describe('AutXML SwitchCase validation', () => {
  it('should be valid when no SwitchCase property is set', () => {
    const autXML = new AutXML();
    const errors = validateSync(autXML);
    // SwitchCase errors should not be present when no SwitchCase property is set
    const switchCaseErrors = errors.filter((error) =>
      error.constraints &&
      Object.values(error.constraints).some((message) =>
        typeof message === 'string' && message.includes('already setted'),
      ),
    );
    expect(switchCaseErrors.length).toBe(0);
  });

  it('should be valid when only CNPJ is set', () => {
    const autXML = new AutXML();
    autXML.CNPJ = '12345678901234';
    const errors = validateSync(autXML);
    // SwitchCase errors should not be present when only one SwitchCase property is set
    const switchCaseErrors = errors.filter((error) =>
      error.constraints &&
      Object.values(error.constraints).some((message) =>
        typeof message === 'string' && message.includes('already setted'),
      ),
    );
    expect(switchCaseErrors.length).toBe(0);
  });

  it('should be valid when only CPF is set', () => {
    const autXML = new AutXML();
    autXML.CPF = '12345678901';
    const errors = validateSync(autXML);
    // SwitchCase errors should not be present when only one SwitchCase property is set
    const switchCaseErrors = errors.filter((error) =>
      error.constraints &&
      Object.values(error.constraints).some((message) =>
        typeof message === 'string' && message.includes('already setted'),
      ),
    );
    expect(switchCaseErrors.length).toBe(0);
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
          typeof message === 'string' && message.includes('already setted'),
      ),
    ).toBe(true);
  });
});
