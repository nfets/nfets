import type { DeepPartial } from '@nfets/core/shared';
import { DefaultTotalBuilderAggregator } from '@nfets/nfe/application/aggregator/total-builder-aggregator';
import type { Det } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det';
import type { Total } from '@nfets/nfe/domain/entities/nfe/inf-nfe/total';
import type { Schema } from '@nfets/nfe/domain/entities/transmission/schemas';

const createHarness = (schema: Schema = 'PL_009_V4') => {
  const state = {
    schema,
    infNFe: {
      total: {
        ICMSTot: {
          vProd: '100.00',
          vDesc: '0.00',
          vST: '0.00',
          vFCPST: '0.00',
          vICMSMonoReten: '0.00',
          vFrete: '0.00',
          vSeg: '0.00',
          vOutro: '0.00',
          vII: '0.00',
          vIPI: '0.00',
          vIPIDevol: '0.00',
        },
      } as Total,
      det: [] as Det[],
    },
  };

  const builder = {
    get schema() {
      return state.schema;
    },
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
      state.infNFe.total = {
        ...state.infNFe.total,
        ...result,
        ICMSTot: { ...state.infNFe.total.ICMSTot, ...result.ICMSTot },
      };
      return builder;
    },
  };

  return {
    state,
    aggregator: new DefaultTotalBuilderAggregator(builder),
  };
};

describe('DefaultTotalBuilderAggregator', () => {
  it('should compute vNF without deductible ICMS desoneracao', () => {
    const { aggregator, state } = createHarness();
    state.infNFe.det = [
      {
        imposto: {
          ICMS: {
            ICMS20: {
              orig: '0',
              CST: '20',
              modBC: '3',
              pRedBC: '0.0000',
              vBC: '100.00',
              pICMS: '18.0000',
              vICMS: '18.00',
              vICMSDeson: '10.00',
              indDeduzDeson: '0',
            },
          },
        },
      },
    ] as Det[];

    aggregator.aggregate();

    expect(state.infNFe.total.ICMSTot.vNF).toBe('100.00');
  });

  it('should deduct vICMSDeson when indDeduzDeson is 1', () => {
    const { aggregator, state } = createHarness();
    state.infNFe.det = [
      {
        imposto: {
          ICMS: {
            ICMS20: {
              orig: '0',
              CST: '20',
              modBC: '3',
              pRedBC: '0.0000',
              vBC: '100.00',
              pICMS: '18.0000',
              vICMS: '18.00',
              vICMSDeson: '10.00',
              indDeduzDeson: '1',
            },
          },
        },
      },
    ] as Det[];

    aggregator.aggregate();

    expect(state.infNFe.total.ICMSTot.vNF).toBe('90.00');
  });

  it('should sum vItem into vNFTot for PL_010', () => {
    const { aggregator, state } = createHarness('PL_010_V1.30');
    state.infNFe.det = [{ vItem: '50.00' }, { vItem: '25.50' }] as Det[];

    aggregator.aggregate();

    expect(state.infNFe.total.vNFTot).toBe('75.50');
  });

  it('should sum missing vItem as zero when aggregating PL_010 vNFTot', () => {
    const { aggregator, state } = createHarness('PL_010_V1.30');
    state.infNFe.det = [{}, { vItem: '10.00' }] as Det[];

    aggregator.aggregate();

    expect(state.infNFe.total.vNFTot).toBe('10.00');
  });

  it('should treat missing schema as non PL_010 and ignore missing vItem', () => {
    const state = {
      infNFe: {
        total: {
          ICMSTot: {
            vProd: '100.00',
            vDesc: '0.00',
            vST: '0.00',
            vFCPST: '0.00',
            vICMSMonoReten: '0.00',
            vFrete: '0.00',
            vSeg: '0.00',
            vOutro: '0.00',
            vII: '0.00',
            vIPI: '0.00',
            vIPIDevol: '0.00',
          },
        } as Total,
        det: [{}, { vItem: '10.00' }] as Det[],
      },
    };

    const builder = {
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
        state.infNFe.total = {
          ...state.infNFe.total,
          ...result,
          ICMSTot: { ...state.infNFe.total.ICMSTot, ...result.ICMSTot },
        };
        return builder;
      },
    };

    new DefaultTotalBuilderAggregator(builder).aggregate();

    expect(state.infNFe.total.vNFTot).toBeUndefined();
    expect(state.infNFe.total.ICMSTot.vNF).toBe('100.00');
  });

  it('should return zero deductible when det list is empty', () => {
    const { aggregator, state } = createHarness();
    state.infNFe.det = [];

    aggregator.aggregate();

    expect(state.infNFe.total.ICMSTot.vNF).toBe('100.00');
  });
});
