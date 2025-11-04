import { validateSync } from 'class-validator';
import { Ide, RefNFP } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/ide';

describe('RefNFP SwitchCase validation (within Ide)', () => {
  const createValidIde = (): Ide => {
    const ide = new Ide();
    ide.cUF = '52';
    ide.cNF = '78527251';
    ide.natOp = 'Venda de mercadoria';
    ide.mod = '55';
    ide.serie = '99';
    ide.nNF = '8018';
    ide.dhEmi = '2024-06-12T06:55:26-03:00';
    ide.tpNF = '1';
    ide.idDest = '2';
    ide.cMunFG = '5212501';
    ide.tpImp = '1';
    ide.tpEmis = '1';
    ide.cDV = '5';
    ide.tpAmb = '2';
    ide.finNFe = '1';
    ide.indFinal = '0';
    ide.indPres = '1';
    ide.procEmi = '0';
    ide.verProc = 'nfets-0.0.1';
    return ide;
  };

  it('should be valid when RefNFP has no SwitchCase property set', () => {
    const ide = createValidIde();
    const refNFP = new RefNFP();
    refNFP.cUF = '52';
    refNFP.AAMM = '2406';
    refNFP.IE = '123456789012';
    refNFP.mod = '55';
    refNFP.serie = '99';
    refNFP.nNF = '8018';
    ide.NFref = [{ refNFP }];

    const errors = validateSync(ide);
    const switchCaseErrors = errors.filter(
      (error) =>
        error.constraints &&
        Object.values(error.constraints).some(
          (message) =>
            typeof message === 'string' && message.includes('already setted'),
        ),
    );
    expect(switchCaseErrors.length).toBe(0);
  });

  it('should be valid when RefNFP has only CNPJ set', () => {
    const ide = createValidIde();
    const refNFP = new RefNFP();
    refNFP.cUF = '52';
    refNFP.AAMM = '2406';
    refNFP.CNPJ = '12345678901234';
    refNFP.IE = '123456789012';
    refNFP.mod = '55';
    refNFP.serie = '99';
    refNFP.nNF = '8018';
    ide.NFref = [{ refNFP }];

    const errors = validateSync(ide);
    const switchCaseErrors = errors.filter(
      (error) =>
        error.constraints &&
        Object.values(error.constraints).some(
          (message) =>
            typeof message === 'string' && message.includes('already setted'),
        ),
    );
    expect(switchCaseErrors.length).toBe(0);
  });

  it('should be valid when RefNFP has only CPF set', () => {
    const ide = createValidIde();
    const refNFP = new RefNFP();
    refNFP.cUF = '52';
    refNFP.AAMM = '2406';
    refNFP.CPF = '12345678901';
    refNFP.IE = '123456789012';
    refNFP.mod = '55';
    refNFP.serie = '99';
    refNFP.nNF = '8018';
    ide.NFref = [{ refNFP }];

    const errors = validateSync(ide);
    const switchCaseErrors = errors.filter(
      (error) =>
        error.constraints &&
        Object.values(error.constraints).some(
          (message) =>
            typeof message === 'string' && message.includes('already setted'),
        ),
    );
    expect(switchCaseErrors.length).toBe(0);
  });

  it('should be invalid when RefNFP has both CNPJ and CPF set', () => {
    const ide = createValidIde();
    const refNFP = new RefNFP();
    refNFP.cUF = '52';
    refNFP.AAMM = '2406';
    refNFP.CNPJ = '12345678901234';
    refNFP.CPF = '12345678901';
    refNFP.IE = '123456789012';
    refNFP.mod = '55';
    refNFP.serie = '99';
    refNFP.nNF = '8018';
    ide.NFref = [{ refNFP }];

    const errors = validateSync(ide);
    expect(errors.length).toBeGreaterThan(0);

    const nfrefError = errors.find((error) => error.property === 'NFref');
    expect(nfrefError).toBeDefined();

    if (nfrefError?.children && nfrefError.children.length > 0) {
      const childError = nfrefError.children[0];
      const refNFPError = childError.children?.find(
        (error) => error.property === 'refNFP',
      );

      if (refNFPError?.children) {
        const cpfError = refNFPError.children.find(
          (error) => error.property === 'CPF',
        );
        expect(cpfError).toBeDefined();
        expect(cpfError?.constraints).toBeDefined();
        expect(
          Object.values(cpfError?.constraints ?? {}).some(
            (message) =>
              typeof message === 'string' && message.includes('already setted'),
          ),
        ).toBe(true);
      }
    }
  });
});
