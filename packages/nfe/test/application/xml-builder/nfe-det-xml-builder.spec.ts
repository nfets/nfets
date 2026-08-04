import type { DeepPartial } from '@nfets/core/shared';
import { DefaultDetBuilderAggregator } from '@nfets/nfe/application/aggregator/det-builder-aggregator';
import { NfeDetXmlBuilder } from '@nfets/nfe/application/xml-builder/nfe-det-xml-builder';
import type { Det } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det';
import type { Total } from '@nfets/nfe/domain/entities/nfe/inf-nfe/total';
import type { NFe } from '@nfets/nfe/domain/entities/nfe/nfe';
import type { INfeXmlBuilder } from '@nfets/nfe/domain/entities/xml-builder/nfe-xml-builder';

const mergeTotalIncrement = (total: Total, result: Partial<Total>): Total => ({
  ...total,
  ICMSTot: { ...total.ICMSTot, ...result.ICMSTot },
  ISSQNtot: result.ISSQNtot
    ? { ...total.ISSQNtot, ...result.ISSQNtot }
    : total.ISSQNtot,
});

const createDetBuilder = (schema: 'PL_009_V4' | 'PL_010_V1.30' = 'PL_009_V4') => {
  const state = {
    infNFe: {
      total: { ICMSTot: {} } as Total,
      det: [] as Det[],
    },
  };

  const parent = {
    increment(
      callback: (
        context: DeepPartial<Total>,
        det: DeepPartial<Det[]>,
      ) => DeepPartial<Total>,
    ) {
      const result = callback(
        state.infNFe.total,
        state.infNFe.det,
      ) as Partial<Total>;
      state.infNFe.total = mergeTotalIncrement(state.infNFe.total, result);
      return parent;
    },
  } as unknown as INfeXmlBuilder<NFe>;

  const aggregator = new DefaultDetBuilderAggregator(parent);

  return {
    state,
    builder: NfeDetXmlBuilder.create(aggregator, schema),
  };
};

const baseProd = {
  cProd: '1',
  cEAN: 'SEM GTIN',
  xProd: 'Produto',
  NCM: '00000000',
  CFOP: '5102',
  uCom: 'UN',
  qCom: '1.0000',
  vUnCom: '3.4900000000',
  vProd: '3.49',
  cEANTrib: 'SEM GTIN',
  uTrib: 'UN',
  qTrib: '1.0000',
  vUnTrib: '3.4900000000',
  indTot: '1' as const,
};

describe('NfeDetXmlBuilder (unit)', () => {
  it('should aggregate vTotTrib once when imposto is set before icms/pis/cofins', () => {
    const { builder, state } = createDetBuilder();

    builder
      .det({ nItem: '1' })
      .prod(baseProd)
      .imposto({ vTotTrib: '0.71' })
      .icms({
        ICMS00: {
          orig: '0',
          CST: '00',
          modBC: '3',
          vBC: '3.49',
          pICMS: '7.0000',
          vICMS: '0.24',
        },
      })
      .pis({ PISNT: { CST: '08' } })
      .cofins({ COFINSNT: { CST: '08' } })
      .assemble();

    expect(state.infNFe.total.ICMSTot.vTotTrib).toBe('0.71');
  });

  it('should set II and aggregate vII through the listener', () => {
    const { builder, state } = createDetBuilder();

    const det = builder
      .det({ nItem: '1' })
      .prod(baseProd)
      .imposto({})
      .ii({
        vBC: '10.00',
        vDespAdu: '0.00',
        vII: '1.50',
        vIOF: '0.00',
      })
      .assemble();

    expect(det.imposto?.II?.vII).toBe('1.50');
    expect(state.infNFe.total.ICMSTot.vII).toBe('1.50');
  });

  it('should set PISST, COFINSST and ICMSUFDest without requiring a listener', () => {
    const builder = NfeDetXmlBuilder.create();

    const det = builder
      .det({ nItem: '1' })
      .prod(baseProd)
      .imposto({})
      .pisst({
        vBC: '10.00',
        pPIS: '1.0000',
        vPIS: '0.10',
        indSomaPISST: '1',
      })
      .cofinsst({
        vBC: '10.00',
        pCOFINS: '1.0000',
        vCOFINS: '0.10',
        indSomaCOFINSST: '1',
      })
      .icmsufdest({
        vBCUFDest: '10.00',
        pFCPUFDest: '0.0000',
        pICMSUFDest: '0.0000',
        pICMSInter: '0.00',
        pICMSInterPart: '0.0000',
        vFCPUFDest: '0.00',
        vICMSUFDest: '0.00',
        vICMSUFRemet: '0.00',
      })
      .assemble();

    expect(det.imposto?.PISST?.vPIS).toBe('0.10');
    expect(det.imposto?.COFINSST?.vCOFINS).toBe('0.10');
    expect(det.imposto?.ICMSUFDest?.vBCUFDest).toBe('10.00');
  });

  it('should ignore null IS and IBSCBS payloads on PL_010', () => {
    const { builder } = createDetBuilder('PL_010_V1.30');

    const det = builder
      .det({ nItem: '1' })
      .prod(baseProd)
      .imposto({})
      .icms({
        ICMS00: {
          orig: '0',
          CST: '00',
          modBC: '3',
          vBC: '3.49',
          pICMS: '7.0000',
          vICMS: '0.24',
        },
      })
      .is(undefined)
      .ibscbs(undefined)
      .assemble();

    expect(det.imposto?.IS).toBeUndefined();
    expect(det.imposto?.IBSCBS).toBeUndefined();
  });

  it('should set IS, IBSCBS, vItem and DFeReferenciado on PL_010', () => {
    const { builder } = createDetBuilder('PL_010_V1.30');

    const det = builder
      .det({ nItem: '1' })
      .prod(baseProd)
      .imposto({})
      .icms({
        ICMS00: {
          orig: '0',
          CST: '00',
          modBC: '3',
          vBC: '3.49',
          pICMS: '7.0000',
          vICMS: '0.24',
        },
      })
      .is({
        CSTIS: '000',
        cClassTribIS: '000001',
        vBCIS: '3.49',
        pIS: '1.00',
        vIS: '0.03',
      })
      .ibscbs({
        CST: '000',
        cClassTrib: '000001',
        gIBSCBS: {
          vBC: '3.49',
          vIBS: '0.03',
          gIBSUF: { pIBSUF: '0.10', vIBSUF: '0.00' },
          gIBSMun: { pIBSMun: '0.00', vIBSMun: '0.00' },
          gCBS: { pCBS: '0.90', vCBS: '0.03' },
        },
      })
      .vItem({ vItem: '3.55' })
      .dfeReferenciado({
        chaveAcesso: '52240646755763000143550010000000011459417288',
        nItem: '1',
      })
      .assemble();

    expect(det.imposto?.IS?.vIS).toBe('0.03');
    expect(det.imposto?.IBSCBS?.CST).toBe('000');
    expect(det.vItem).toBe('3.55');
    expect(det.DFeReferenciado?.chaveAcesso).toBe(
      '52240646755763000143550010000000011459417288',
    );
  });

  it('should default schema to PL_009_V4 when constructor omits it', () => {
    class ExposedDetBuilder extends NfeDetXmlBuilder<'PL_009_V4'> {
      public constructor() {
        super();
      }
    }

    expect(new ExposedDetBuilder().schema).toBe('PL_009_V4');
  });
});
