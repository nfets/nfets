import { validateSync } from 'class-validator';
import { DI, Adi } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/di';
import { Decimal } from '@nfets/core/infrastructure';

describe('DI SwitchCase validation', () => {
  const createValidDI = (): DI => {
    const di = new DI();
    di.nDI = '123456789';
    di.dDI = '2024-01-01';
    di.xLocDesemb = 'Local de Desembarque';
    di.UFDesemb = 'GO';
    di.dDesemb = '2024-01-02';
    di.tpViaTransp = '1';
    di.tpIntermedio = '1';

    const adi = new Adi();
    adi.nAdicao = '1';
    adi.nSeqAdic = '1';
    adi.cFabricante = '12345678901234';
    adi.vDescDI = Decimal.from('100').toString();
    di.adi = [adi];

    return di;
  };

  it('should be valid when no SwitchCase property is set', () => {
    const di = createValidDI();
    const errors = validateSync(di);
    expect(errors.length).toBe(0);
  });

  it('should be valid when only CNPJ is set', () => {
    const di = createValidDI();
    di.CNPJ = '12345678901234';
    const errors = validateSync(di);
    expect(errors.length).toBe(0);
  });

  it('should be valid when only CPF is set', () => {
    const di = createValidDI();
    di.CPF = '12345678901';
    const errors = validateSync(di);
    expect(errors.length).toBe(0);
  });

  it('should be invalid when both CNPJ and CPF are set', () => {
    const di = createValidDI();
    di.CNPJ = '12345678901234';
    di.CPF = '12345678901';

    const errors = validateSync(di);
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
