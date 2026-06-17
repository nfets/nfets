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

const createDetBuilder = () => {
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
    builder: NfeDetXmlBuilder.create(aggregator),
  };
};

describe('NfeDetXmlBuilder (unit)', () => {
  it('should aggregate vTotTrib once when imposto is set before icms/pis/cofins', () => {
    const { builder, state } = createDetBuilder();

    builder
      .det({ nItem: '1' })
      .prod({
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
        indTot: '1',
      })
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
});
