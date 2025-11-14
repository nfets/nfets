import { validateSync } from 'class-validator';
import { Emit } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/emit';
import { EnderEmit } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/emit/ender-emit';

describe('Emit Choice validation', () => {
  const createValidEmit = (): Emit => {
    const emit = new Emit();
    emit.xNome = 'Cliente Teste';
    const enderEmit = new EnderEmit();
    enderEmit.xLgr = 'Rua Teste';
    enderEmit.nro = '123';
    enderEmit.xBairro = 'Centro';
    enderEmit.cMun = '5212501';
    enderEmit.xMun = 'Luziania';
    enderEmit.UF = 'GO';
    emit.enderEmit = enderEmit;
    emit.IE = '123456789012';
    emit.CRT = '1';
    return emit;
  };

  it('should be invalid when no Choice property is set', () => {
    const emit = createValidEmit();
    const errors = validateSync(emit);
    const choiceErrors = errors.filter(
      (error) =>
        error.constraints &&
        (error.constraints.choiceGroupRequired ||
          Object.values(error.constraints).some(
            (message) =>
              typeof message === 'string' &&
              (message.includes('cannot be set because') ||
                message.includes('already set')),
          )),
    );
    expect(choiceErrors.length).toBe(1);
  });

  it('should be valid when only CNPJ is set', () => {
    const emit = createValidEmit();
    emit.CNPJ = '12345678901234';
    const errors = validateSync(emit);
    const choiceErrors = errors.filter(
      (error) =>
        error.constraints &&
        (error.constraints.choiceGroupRequired ||
          Object.values(error.constraints).some(
            (message) =>
              typeof message === 'string' &&
              (message.includes('cannot be set because') ||
                message.includes('already set')),
          )),
    );
    expect(choiceErrors.length).toBe(0);
  });

  it('should be valid when only CPF is set', () => {
    const emit = createValidEmit();
    emit.CPF = '12345678901';
    const errors = validateSync(emit);
    const choiceErrors = errors.filter(
      (error) =>
        error.constraints &&
        (error.constraints.choiceGroupRequired ||
          Object.values(error.constraints).some(
            (message) =>
              typeof message === 'string' &&
              (message.includes('cannot be set because') ||
                message.includes('already set')),
          )),
    );
    expect(choiceErrors.length).toBe(0);
  });

  it('should be invalid when both CNPJ and CPF are set', () => {
    const emit = createValidEmit();
    emit.CNPJ = '12345678901234';
    emit.CPF = '12345678901';

    const errors = validateSync(emit);
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
