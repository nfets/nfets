import type { DeepPartial } from '@nfets/core/shared';
import { Xml2JsToolkit } from '@nfets/core/infrastructure';
import { expectIsRight } from '@nfets/test/expects';
import { DefaultDetBuilderAggregator } from '@nfets/nfe/application/aggregator/det-builder-aggregator';
import { NfeXmlBuilder } from '@nfets/nfe/application/xml-builder/nfe-xml-builder';
import type { Det } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det';
import type { Total } from '@nfets/nfe/domain/entities/nfe/inf-nfe/total';
import type { NFe } from '@nfets/nfe/domain/entities/nfe/nfe';
import type { INfeXmlBuilder } from '@nfets/nfe/domain/entities/xml-builder/nfe-xml-builder';
import {
  createIssqnPayload,
  createIssqnServiceProd,
  createValidEmit,
  createValidIde,
  createValidItems,
  createValidPag,
  createValidTransp,
} from '../../fixtures/data';

const mergeTotalIncrement = (total: Total, result: Partial<Total>): Total => ({
  ...total,
  ICMSTot: { ...total.ICMSTot, ...result.ICMSTot },
  ISSQNtot: result.ISSQNtot
    ? { ...total.ISSQNtot, ...result.ISSQNtot }
    : total.ISSQNtot,
});

const createBuilderHarness = () => {
  const state = {
    infNFe: {
      total: { ICMSTot: {} } as Total,
      det: [] as Det[],
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
      state.infNFe.total = mergeTotalIncrement(state.infNFe.total, result);
      return builder;
    },
  } as unknown as INfeXmlBuilder<NFe>;

  return {
    builder,
    state,
    aggregator: new DefaultDetBuilderAggregator(builder),
  };
};

describe('DefaultDetBuilderAggregator ISSQNtot (unit)', () => {
  it('should set vISS from vISSQN on the first issqn call', () => {
    const { aggregator, state } = createBuilderHarness();

    aggregator.issqn(createIssqnPayload({ vISSQN: '12.50' }));

    expect(state.infNFe.total.ISSQNtot).toEqual({ vISS: '12.50' });
  });

  it('should accumulate vISS across multiple issqn calls', () => {
    const { aggregator, state } = createBuilderHarness();

    aggregator.issqn(createIssqnPayload({ vISSQN: '10.00' }));
    aggregator.issqn(createIssqnPayload({ vISSQN: '7.25' }));

    expect(state.infNFe.total.ISSQNtot?.vISS).toBe('17.25');
  });

  it('should add vISSQN to an existing vISS total', () => {
    const { aggregator, state } = createBuilderHarness();
    state.infNFe.total.ISSQNtot = { dCompet: '2024-06-01', vISS: '3.00' };

    aggregator.issqn(createIssqnPayload({ vISSQN: '2.50' }));

    expect(state.infNFe.total.ISSQNtot).toEqual({
      dCompet: '2024-06-01',
      vISS: '5.50',
    });
  });

  it('should preserve other ISSQNtot fields when incrementing vISS', () => {
    const { aggregator, state } = createBuilderHarness();
    state.infNFe.total.ISSQNtot = {
      dCompet: '2024-06-01',
      vServ: '100.00',
      vBC: '200.00',
    };

    aggregator.issqn(createIssqnPayload({ vISSQN: '5.00' }));

    expect(state.infNFe.total.ISSQNtot).toEqual({
      dCompet: '2024-06-01',
      vServ: '100.00',
      vBC: '200.00',
      vISS: '5.00',
    });
  });

  it('should format vISS with two decimal places', () => {
    const { aggregator, state } = createBuilderHarness();

    aggregator.issqn(createIssqnPayload({ vISSQN: '10.005' }));

    expect(state.infNFe.total.ISSQNtot?.vISS).toBe('10.01');
  });

  it('should not mutate ICMSTot when aggregating ISSQNtot', () => {
    const { aggregator, state } = createBuilderHarness();
    state.infNFe.total.ICMSTot = { vProd: '50.00' } as Total['ICMSTot'];

    aggregator.issqn(createIssqnPayload({ vISSQN: '5.00' }));

    expect(state.infNFe.total.ICMSTot).toEqual({ vProd: '50.00' });
    expect(state.infNFe.total.ISSQNtot?.vISS).toBe('5.00');
  });
});

describe('DefaultDetBuilderAggregator ISSQNtot via NfeXmlBuilder (unit)', () => {
  class ExposedNfeXmlBuilder extends NfeXmlBuilder {
    public get totalSpy() {
      return this.data.infNFe.total;
    }
  }

  const toolkit = new Xml2JsToolkit();

  it('should aggregate vISS from multiple det items with ISSQN', async () => {
    const issqnSpy = jest.spyOn(DefaultDetBuilderAggregator.prototype, 'issqn');
    const items = [
      {
        description: 'Service 1',
        code: '1',
        price: 100,
        quantity: 1,
        unit: 'UN',
        total: 100,
      },
      {
        description: 'Service 2',
        code: '2',
        price: 50,
        quantity: 1,
        unit: 'UN',
        total: 50,
      },
    ] as [
      {
        description: string;
        code: string;
        price: number;
        quantity: number;
        unit: string;
        total: number;
      },
      {
        description: string;
        code: string;
        price: number;
        quantity: number;
        unit: string;
        total: number;
      },
    ];
    const vISSQNByItem = ['4.00', '6.50'];
    let detIndex = 0;

    const builder = ExposedNfeXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide(createValidIde())
      .emit(createValidEmit())
      .det(items, (ctx, item) =>
        ctx
          .prod({
            cProd: item.code,
            cEAN: 'SEM GTIN',
            xProd: item.description,
            NCM: '00000000',
            CFOP: '5102',
            uCom: item.unit,
            qCom: item.quantity,
            vUnCom: item.price,
            vProd: item.total,
            cEANTrib: 'SEM GTIN',
            uTrib: item.unit,
            qTrib: item.quantity,
            vUnTrib: item.price,
            indTot: '1',
          })
          .issqn(createIssqnPayload({ vISSQN: vISSQNByItem[detIndex++] })),
      )
      .transp(createValidTransp())
      .pag(createValidPag())
      .quiet();

    expect(issqnSpy).toHaveBeenCalledTimes(2);
    expect((builder as ExposedNfeXmlBuilder).totalSpy.ISSQNtot?.vISS).toBe(
      '10.50',
    );

    const result = await builder.assemble();
    expectIsRight(result);
    expect((builder as ExposedNfeXmlBuilder).totalSpy.ISSQNtot?.vISS).toBe(
      '10.50',
    );

    issqnSpy.mockRestore();
  });

  it('should not call issqn aggregator when issqn payload is undefined', () => {
    const issqnSpy = jest.spyOn(DefaultDetBuilderAggregator.prototype, 'issqn');

    ExposedNfeXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide(createValidIde())
      .emit(createValidEmit())
      .det(createValidItems(), (ctx, item) =>
        ctx
          .prod({
            cProd: item.code,
            cEAN: 'SEM GTIN',
            xProd: item.description,
            NCM: '00000000',
            CFOP: '5102',
            uCom: item.unit,
            qCom: item.quantity,
            vUnCom: item.price,
            vProd: item.total,
            cEANTrib: 'SEM GTIN',
            uTrib: item.unit,
            qTrib: item.quantity,
            vUnTrib: item.price,
            indTot: '1',
          })
          .issqn(undefined)
          .icms({
            ICMS00: {
              orig: '0',
              CST: '00',
              modBC: '0',
              vBC: '100.00',
              pICMS: '18.0000',
              vICMS: '18.00',
            },
          }),
      )
      .transp(createValidTransp())
      .pag(createValidPag())
      .quiet();

    expect(issqnSpy).not.toHaveBeenCalled();
    issqnSpy.mockRestore();
  });

  it('should not call icms aggregator when icms payload is undefined', () => {
    const icmsSpy = jest.spyOn(DefaultDetBuilderAggregator.prototype, 'icms');

    ExposedNfeXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide(createValidIde())
      .emit(createValidEmit())
      .det(createValidItems(), (ctx, item) =>
        ctx
          .prod(createIssqnServiceProd(item))
          .icms(undefined)
          .issqn(createIssqnPayload()),
      )
      .transp(createValidTransp())
      .pag(createValidPag())
      .quiet();

    expect(icmsSpy).not.toHaveBeenCalled();
    icmsSpy.mockRestore();
  });
});

describe('DefaultDetBuilderAggregator ICMSTot (unit)', () => {
  it('should aggregate ICMS61 monophasic fields', () => {
    const { aggregator, state } = createBuilderHarness();

    aggregator.icms({
      ICMS61: {
        orig: '0',
        CST: '61',
        qBCMonoRet: '1.0000',
        adRemICMSRet: '0.0000',
        vICMSMonoRet: '0.00',
      },
    });

    expect(state.infNFe.total.ICMSTot).toEqual({
      vBC: '0.00',
      vICMS: '0.00',
      vICMSDeson: '0.00',
      vBCST: '0.00',
      vST: '0.00',
      vFCP: '0.00',
      vFCPST: '0.00',
      vFCPSTRet: '0.00',
      qBCMono: '0.00',
      vICMSMono: '0.00',
      qBCMonoReten: '0.00',
      vICMSMonoReten: '0.00',
      qBCMonoRet: '1.00',
      vICMSMonoRet: '0.00',
    });
  });

  it('should aggregate prod, imposto, pis and cofins fields', () => {
    const { aggregator, state } = createBuilderHarness();

    aggregator.prod({
      cProd: '1',
      cEAN: 'SEM GTIN',
      xProd: 'GLP',
      NCM: '00000000',
      CFOP: '5656',
      uCom: 'KG',
      qCom: '1.0000',
      vUnCom: '120.0000',
      vProd: '120.00',
      cEANTrib: 'SEM GTIN',
      uTrib: 'KG',
      qTrib: '1.0000',
      vUnTrib: '120.0000',
      indTot: '1',
    });
    aggregator.imposto({ vTotTrib: 39.54 });
    aggregator.pis({ PISNT: { CST: '08' } });
    aggregator.cofins({ COFINSNT: { CST: '08' } });

    expect(state.infNFe.total.ICMSTot).toMatchObject({
      vProd: '120.00',
      vTotTrib: '39.54',
      vPIS: '0.00',
      vCOFINS: '0.00',
    });
  });
});
