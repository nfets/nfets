import { validateSync } from 'class-validator';
import { ConsultaCadastroPayload } from '@nfets/nfe/infrastructure/dto/services/consulta-cadastro';

describe('ConsultaCadastroPayload SwitchCase validation', () => {
  it('should be valid when no SwitchCase property is set', () => {
    const payload = new ConsultaCadastroPayload();
    payload.UF = 'GO';

    const errors = validateSync(payload);
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
    const payload = new ConsultaCadastroPayload();
    payload.UF = 'GO';
    payload.CNPJ = '12345678901234';

    const errors = validateSync(payload);
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
    const payload = new ConsultaCadastroPayload();
    payload.UF = 'GO';
    payload.CPF = '12345678901';

    const errors = validateSync(payload);
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
    const payload = new ConsultaCadastroPayload();
    payload.UF = 'GO';
    payload.CNPJ = '12345678901234';
    payload.CPF = '12345678901';

    const errors = validateSync(payload);
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
