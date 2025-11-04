import { validateSync } from 'class-validator';
import { ICMS } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/icms';
import { ICMS00 } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/icms';
import { ICMS10 } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/icms';
import { ICMS20 } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/icms';
import { ICMS30 } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/icms';
import { ICMS40 } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/icms';
import { ICMS51 } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/icms';
import { ICMS60 } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/icms';
import { ICMS70 } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/icms';
import { ICMS90 } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/icms';
import { ICMSPart } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/icms';
import { ICMSST } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/icms';
import { ICMSSN101 } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/icms';
import { ICMSSN102 } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/icms';
import { ICMSSN201 } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/icms';
import { ICMSSN202 } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/icms';
import { ICMSSN500 } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/icms';
import { ICMSSN900 } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/icms';

describe('ICMS Choice validation', () => {
  const choiceProperties = [
    'ICMS00',
    'ICMS10',
    'ICMS20',
    'ICMS30',
    'ICMS40',
    'ICMS51',
    'ICMS60',
    'ICMS70',
    'ICMS90',
    'ICMSPart',
    'ICMSST',
    'ICMSSN101',
    'ICMSSN102',
    'ICMSSN201',
    'ICMSSN202',
    'ICMSSN500',
    'ICMSSN900',
  ];

  it('should be valid when no Choice property is set', () => {
    const icms = new ICMS();
    const errors = validateSync(icms);
    expect(errors.length).toBe(0);
  });

  for (const property of choiceProperties) {
    it(`should be valid when only ${property} is set`, () => {
      const icms = new ICMS();
      const icmsType = getICMSType(property);
      if (icmsType) {
        (icms as unknown as Record<string, unknown>)[property] = icmsType;
        const errors = validateSync(icms);
        expect(errors.length).toBe(0);
      }
    });
  }

  it('should be invalid when multiple Choice properties are set', () => {
    const icms = new ICMS();
    const icms00 = new ICMS00();
    icms00.orig = '0';
    icms00.CST = '00';
    icms.ICMS00 = icms00;

    const icms10 = new ICMS10();
    icms10.orig = '0';
    icms10.CST = '10';
    icms.ICMS10 = icms10;

    const errors = validateSync(icms);
    expect(errors.length).toBeGreaterThan(0);

    const icms10Error = errors.find((error) => error.property === 'ICMS10');
    expect(icms10Error).toBeDefined();
    expect(icms10Error?.constraints).toBeDefined();
    expect(
      Object.values(icms10Error?.constraints ?? {}).some(
        (message) =>
          typeof message === 'string' &&
          (message.includes('cannot be set because') ||
            message.includes('already set')),
      ),
    ).toBe(true);
  });

  function getICMSType(property: string) {
    switch (property) {
      case 'ICMS00': {
        const icms = new ICMS00();
        icms.orig = '0';
        icms.CST = '00';
        return icms;
      }
      case 'ICMS10': {
        const icms = new ICMS10();
        icms.orig = '0';
        icms.CST = '10';
        return icms;
      }
      case 'ICMS20': {
        const icms = new ICMS20();
        icms.orig = '0';
        icms.CST = '20';
        return icms;
      }
      case 'ICMS30': {
        const icms = new ICMS30();
        icms.orig = '0';
        icms.CST = '30';
        return icms;
      }
      case 'ICMS40': {
        const icms = new ICMS40();
        icms.orig = '0';
        icms.CST = '40';
        return icms;
      }
      case 'ICMS51': {
        const icms = new ICMS51();
        icms.orig = '0';
        icms.CST = '51';
        return icms;
      }
      case 'ICMS60': {
        const icms = new ICMS60();
        icms.orig = '0';
        icms.CST = '60';
        return icms;
      }
      case 'ICMS70': {
        const icms = new ICMS70();
        icms.orig = '0';
        icms.CST = '70';
        return icms;
      }
      case 'ICMS90': {
        const icms = new ICMS90();
        icms.orig = '0';
        icms.CST = '90';
        return icms;
      }
      case 'ICMSPart': {
        const icms = new ICMSPart();
        icms.orig = '0';
        icms.CST = '10';
        return icms;
      }
      case 'ICMSST': {
        const icms = new ICMSST();
        icms.orig = '0';
        icms.CST = '60';
        return icms;
      }
      case 'ICMSSN101': {
        const icms = new ICMSSN101();
        icms.orig = '0';
        icms.CSOSN = '101';
        return icms;
      }
      case 'ICMSSN102': {
        const icms = new ICMSSN102();
        icms.orig = '0';
        icms.CSOSN = '102';
        return icms;
      }
      case 'ICMSSN201': {
        const icms = new ICMSSN201();
        icms.orig = '0';
        icms.CSOSN = '201';
        return icms;
      }
      case 'ICMSSN202': {
        const icms = new ICMSSN202();
        icms.orig = '0';
        icms.CSOSN = '202';
        return icms;
      }
      case 'ICMSSN500': {
        const icms = new ICMSSN500();
        icms.orig = '0';
        icms.CSOSN = '500';
        return icms;
      }
      case 'ICMSSN900': {
        const icms = new ICMSSN900();
        icms.orig = '0';
        icms.CSOSN = '900';
        return icms;
      }
      default:
        return null;
    }
  }
});
