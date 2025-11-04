import { validateSync } from 'class-validator';
import { Local } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/local';

describe('Local SwitchCase validation', () => {
  it('should be valid when no SwitchCase property is set', () => {
    const local = new Local();
    local.xLgr = 'Rua Teste';
    local.nro = '123';
    local.xBairro = 'Centro';
    local.cMun = '5212501';
    local.xMun = 'Luziania';
    local.UF = 'GO';

    const errors = validateSync(local);
    expect(errors.length).toBe(0);
  });

  it('should be valid when only CNPJ is set', () => {
    const local = new Local();
    local.CNPJ = '12345678901234';
    local.xLgr = 'Rua Teste';
    local.nro = '123';
    local.xBairro = 'Centro';
    local.cMun = '5212501';
    local.xMun = 'Luziania';
    local.UF = 'GO';

    const errors = validateSync(local);
    expect(errors.length).toBe(0);
  });

  it('should be valid when only CPF is set', () => {
    const local = new Local();
    local.CPF = '12345678901';
    local.xLgr = 'Rua Teste';
    local.nro = '123';
    local.xBairro = 'Centro';
    local.cMun = '5212501';
    local.xMun = 'Luziania';
    local.UF = 'GO';

    const errors = validateSync(local);
    expect(errors.length).toBe(0);
  });

  it('should be invalid when both CNPJ and CPF are set', () => {
    const local = new Local();
    local.CNPJ = '12345678901234';
    local.CPF = '12345678901';
    local.xLgr = 'Rua Teste';
    local.nro = '123';
    local.xBairro = 'Centro';
    local.cMun = '5212501';
    local.xMun = 'Luziania';
    local.UF = 'GO';

    const errors = validateSync(local);
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
