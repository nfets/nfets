import { validateSync } from 'class-validator';
import { Imposto } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto';
import { ICMS } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/icms';
import { ICMS00 } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/icms';
import { ISSQN } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/issqn';
import { IBSCBS } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/ibscbs';
import { IBSMun } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/ibscbs/ibs-mun';
import { IBSUF } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/ibscbs/ibs-uf';
import { GIBSCBS } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/ibscbs/gibscbs';

describe('Imposto Choice validation', () => {
  it('should be valid when no Choice property is set', () => {
    const imposto = new Imposto();
    const errors = validateSync(imposto);
    expect(errors.length).toBe(0);
  });

  it('should be valid when only ICMS is set', () => {
    const imposto = new Imposto();
    const icms = new ICMS();
    const icms00 = new ICMS00();
    icms00.orig = '0';
    icms00.CST = '00';
    icms.ICMS00 = icms00;
    imposto.ICMS = icms;

    const errors = validateSync(imposto);
    expect(errors.length).toBe(0);
  });

  it('should be valid when only ISSQN is set', () => {
    const imposto = new Imposto();
    const issqn = new ISSQN();
    imposto.ISSQN = issqn;

    const errors = validateSync(imposto);
    expect(errors.length).toBe(0);
  });

  it('should be invalid when both ICMS and ISSQN are set', () => {
    const imposto = new Imposto();
    const icms = new ICMS();
    const icms00 = new ICMS00();
    icms00.orig = '0';
    icms00.CST = '00';
    icms.ICMS00 = icms00;
    imposto.ICMS = icms;

    const issqn = new ISSQN();
    imposto.ISSQN = issqn;

    const errors = validateSync(imposto);
    expect(errors.length).toBeGreaterThan(0);

    const issqnError = errors.find((error) => error.property === 'ISSQN');
    expect(issqnError).toBeDefined();
    expect(issqnError?.constraints).toBeDefined();
    expect(
      Object.values(issqnError?.constraints ?? {}).some(
        (message) =>
          typeof message === 'string' &&
          (message.includes('cannot be set because') ||
            message.includes('already set')),
      ),
    ).toBe(true);
  });

  it('should be valid when only IBSCBS is set', () => {
    const imposto = new Imposto;
    const ibscbs = new IBSCBS;
    ibscbs.gIBSCBS = new GIBSCBS

    const ibsMun = new IBSMun;
    ibsMun.pIBSMun = '1.0';
    ibsMun.vIBSMun = '1.0';

    const ibsUf = new IBSUF;
    ibsUf.pIBSUF = '2.0';
    ibsUf.vIBSUF = '2.0';

    ibscbs.gIBSCBS.gIBSMun = ibsMun;
    ibscbs.gIBSCBS.gIBSUF = ibsUf;
    imposto.IBSCBS = ibscbs;

    const errors = validateSync(imposto);
    expect(errors.length).toBe(0);
  });
});
