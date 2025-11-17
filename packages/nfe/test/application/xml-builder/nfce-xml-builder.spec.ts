import { Decimal, Xml2JsToolkit, type XmlToolkit } from '@nfets/core';
import { NfceXmlBuilder } from '@nfets/nfe/application';
import { TpEmis } from '@nfets/nfe/domain';
import { expectIsRight, expectNotNull } from '@nfets/test/expects';
import { AccessKeyBuilder } from '@nfets/nfe/application/access-key/access-key-builder';
import {
  createValidEmit,
  createValidIde,
  createValidItems,
  createValidPag,
  createValidTransp,
} from '../../../test/fixtures/data';

describe('xml builder with xml2js builder', () => {
  const toolkit: XmlToolkit = new Xml2JsToolkit();

  it('should stay without contingency when tpEmis="1" and xJust is not provided and dhCont is not provided', () => {
    const builder = NfceXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide({ ...createValidIde(), tpEmis: TpEmis.Normal })
      .emit(createValidEmit())
      .det(createValidItems(), (ctx, item) =>
        ctx
          .prod({
            cProd: item.code,
            cEAN: 'SEM GTIN',
            xProd: item.description,
            NCM: '00',
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
          .icms({
            ICMS00: {
              orig: '1',
              CST: '00',
              modBC: '0',
              vBC: '100',
              pICMS: 18.0,
              vICMS: Decimal.from('18').toString(),
            },
          })
          .ipi({
            cEnq: '999',
            IPINT: {
              CST: '53',
            },
          })
          .pis({
            PISNT: {
              CST: '08',
            },
          })
          .cofins({
            COFINSNT: {
              CST: '08',
            },
          }),
      )
      .transp(createValidTransp())
      .pag(createValidPag());

    const entityOrLeft = builder.toObject();
    expectIsRight(entityOrLeft);

    const nfe = entityOrLeft.value;
    expect(nfe.infNFe.ide.tpEmis).toBe(TpEmis.Normal);
    expect(nfe.infNFe.ide.xJust).toBeUndefined();
    expect(nfe.infNFe.ide.dhCont).toBeUndefined();

    const accessKey = nfe.infNFe.$.Id?.replace('NFe', '');
    expectNotNull(accessKey);

    const decompiled = new AccessKeyBuilder().decompile(accessKey);
    expect(decompiled?.tpEmis).toBe('1');
  });

  it('should toggle to contingency when tpEmis="1" and xJust is provided and dhCont is not provided', () => {
    const builder = NfceXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide({
        ...createValidIde(),
        tpEmis: TpEmis.Normal,
        xJust: 'SEFAZ fora do Ar...',
      })
      .emit(createValidEmit())
      .det(createValidItems(), (ctx, item) =>
        ctx
          .prod({
            cProd: item.code,
            cEAN: 'SEM GTIN',
            xProd: item.description,
            NCM: '00',
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
          .icms({
            ICMS00: {
              orig: '1',
              CST: '00',
              modBC: '0',
              vBC: '100',
              pICMS: 18.0,
              vICMS: Decimal.from('18').toString(),
            },
          })
          .ipi({
            cEnq: '999',
            IPINT: {
              CST: '53',
            },
          })
          .pis({
            PISNT: {
              CST: '08',
            },
          })
          .cofins({
            COFINSNT: {
              CST: '08',
            },
          }),
      )
      .transp(createValidTransp())
      .pag(createValidPag());

    const entityOrLeft = builder.toObject();
    expectIsRight(entityOrLeft);

    const nfe = entityOrLeft.value;
    expect(nfe.infNFe.ide.tpEmis).toBe('9');
    expect(nfe.infNFe.ide.xJust).toBe('SEFAZ fora do Ar...');
    expect(nfe.infNFe.ide.dhCont).toBeDefined();

    const accessKey = nfe.infNFe.$.Id?.replace('NFe', '');
    expectNotNull(accessKey);

    const decompiled = new AccessKeyBuilder().decompile(accessKey);
    expect(decompiled?.tpEmis).toBe('9');
  });

  it('should toggle to contingency when tpEmis="1" and xJust is not provided and dhCont is provided', () => {
    const builder = NfceXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide({
        ...createValidIde(),
        tpEmis: TpEmis.Normal,
        dhCont: '2025-11-13T10:00:00Z',
      })
      .emit(createValidEmit())
      .det(createValidItems(), (ctx, item) =>
        ctx
          .prod({
            cProd: item.code,
            cEAN: 'SEM GTIN',
            xProd: item.description,
            NCM: '00',
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
          .icms({
            ICMS00: {
              orig: '1',
              CST: '00',
              modBC: '0',
              vBC: '100',
              pICMS: 18.0,
              vICMS: Decimal.from('18').toString(),
            },
          })
          .ipi({
            cEnq: '999',
            IPINT: {
              CST: '53',
            },
          })
          .pis({
            PISNT: {
              CST: '08',
            },
          })
          .cofins({
            COFINSNT: {
              CST: '08',
            },
          }),
      )
      .transp(createValidTransp())
      .pag(createValidPag());

    const entityOrLeft = builder.toObject();
    expectIsRight(entityOrLeft);

    const nfe = entityOrLeft.value;
    expect(nfe.infNFe.ide.tpEmis).toBe('9');
    expect(nfe.infNFe.ide.xJust).toBe('SEFAZ fora do Ar');
    expect(nfe.infNFe.ide.dhCont).toBe('2025-11-13T07:00:00-03:00');

    const accessKey = nfe.infNFe.$.Id?.replace('NFe', '');
    expectNotNull(accessKey);

    const decompiled = new AccessKeyBuilder().decompile(accessKey);
    expect(decompiled?.tpEmis).toBe('9');
  });

  it('should toggle to contingency when tpEmis="1" and both xJust and dhCont are provided', () => {
    const builder = NfceXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide({
        ...createValidIde(),
        tpEmis: TpEmis.Normal,
        xJust: 'Contingência manual',
        dhCont: '2025-11-13T10:10:00Z',
      })
      .emit(createValidEmit())
      .det(createValidItems(), (ctx, item) =>
        ctx
          .prod({
            cProd: item.code,
            cEAN: 'SEM GTIN',
            xProd: item.description,
            NCM: '00',
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
          .icms({
            ICMS00: {
              orig: '1',
              CST: '00',
              modBC: '0',
              vBC: '100',
              pICMS: 18.0,
              vICMS: Decimal.from('18').toString(),
            },
          })
          .ipi({
            cEnq: '999',
            IPINT: {
              CST: '53',
            },
          })
          .pis({
            PISNT: {
              CST: '08',
            },
          })
          .cofins({
            COFINSNT: {
              CST: '08',
            },
          }),
      )
      .transp(createValidTransp())
      .pag(createValidPag());

    const entityOrLeft = builder.toObject();
    expectIsRight(entityOrLeft);

    const nfe = entityOrLeft.value;
    expect(nfe.infNFe.ide.tpEmis).toBe('9');
    expect(nfe.infNFe.ide.xJust).toBe('Contingência manual');
    expect(nfe.infNFe.ide.dhCont).toBe('2025-11-13T07:10:00-03:00');

    const accessKey = nfe.infNFe.$.Id?.replace('NFe', '');
    expectNotNull(accessKey);

    const decompiled = new AccessKeyBuilder().decompile(accessKey);
    expect(decompiled?.tpEmis).toBe('9');
  });

  it('should toggle to contingency when tpEmis="9" and xJust is not provided and dhCont is not provided', () => {
    const builder = NfceXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide({
        ...createValidIde(),
        tpEmis: TpEmis.OFFLINE,
      })
      .emit(createValidEmit())
      .det(createValidItems(), (ctx, item) =>
        ctx
          .prod({
            cProd: item.code,
            cEAN: 'SEM GTIN',
            xProd: item.description,
            NCM: '00',
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
          .icms({
            ICMS00: {
              orig: '1',
              CST: '00',
              modBC: '0',
              vBC: '100',
              pICMS: 18.0,
              vICMS: Decimal.from('18').toString(),
            },
          })
          .ipi({
            cEnq: '999',
            IPINT: {
              CST: '53',
            },
          })
          .pis({
            PISNT: {
              CST: '08',
            },
          })
          .cofins({
            COFINSNT: {
              CST: '08',
            },
          }),
      )
      .transp(createValidTransp())
      .pag(createValidPag());

    const entityOrLeft = builder.toObject();
    expectIsRight(entityOrLeft);

    const nfe = entityOrLeft.value;
    expect(nfe.infNFe.ide.tpEmis).toBe('9');
    expect(nfe.infNFe.ide.xJust).toBe('SEFAZ fora do Ar');
    expect(nfe.infNFe.ide.dhCont).toBeDefined();

    const accessKey = nfe.infNFe.$.Id?.replace('NFe', '');
    expectNotNull(accessKey);

    const decompiled = new AccessKeyBuilder().decompile(accessKey);
    expect(decompiled?.tpEmis).toBe('9');
  });

  it('should toggle to contingency when tpEmis="9" and xJust is provided and dhCont is not provided', () => {
    const builder = NfceXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide({
        ...createValidIde(),
        tpEmis: TpEmis.OFFLINE,
        xJust: 'SEFAZ fora do Ar...',
      })
      .emit(createValidEmit())
      .det(createValidItems(), (ctx, item) =>
        ctx
          .prod({
            cProd: item.code,
            cEAN: 'SEM GTIN',
            xProd: item.description,
            NCM: '00',
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
          .icms({
            ICMS00: {
              orig: '1',
              CST: '00',
              modBC: '0',
              vBC: '100',
              pICMS: 18.0,
              vICMS: Decimal.from('18').toString(),
            },
          })
          .ipi({
            cEnq: '999',
            IPINT: {
              CST: '53',
            },
          })
          .pis({
            PISNT: {
              CST: '08',
            },
          })
          .cofins({
            COFINSNT: {
              CST: '08',
            },
          }),
      )
      .transp(createValidTransp())
      .pag(createValidPag());

    const entityOrLeft = builder.toObject();
    expectIsRight(entityOrLeft);

    const nfe = entityOrLeft.value;
    expect(nfe.infNFe.ide.tpEmis).toBe('9');
    expect(nfe.infNFe.ide.xJust).toBe('SEFAZ fora do Ar...');
    expect(nfe.infNFe.ide.dhCont).toBeDefined();

    const accessKey = nfe.infNFe.$.Id?.replace('NFe', '');
    expectNotNull(accessKey);

    const decompiled = new AccessKeyBuilder().decompile(accessKey);
    expect(decompiled?.tpEmis).toBe('9');
  });

  it('should toggle to contingency when tpEmis="9" and xJust is not provided and dhCont is provided', () => {
    const builder = NfceXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide({
        ...createValidIde(),
        tpEmis: TpEmis.OFFLINE,
        dhCont: '2025-11-13T10:10:00Z',
      })
      .emit(createValidEmit())
      .det(createValidItems(), (ctx, item) =>
        ctx
          .prod({
            cProd: item.code,
            cEAN: 'SEM GTIN',
            xProd: item.description,
            NCM: '00',
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
          .icms({
            ICMS00: {
              orig: '1',
              CST: '00',
              modBC: '0',
              vBC: '100',
              pICMS: 18.0,
              vICMS: Decimal.from('18').toString(),
            },
          })
          .ipi({
            cEnq: '999',
            IPINT: {
              CST: '53',
            },
          })
          .pis({
            PISNT: {
              CST: '08',
            },
          })
          .cofins({
            COFINSNT: {
              CST: '08',
            },
          }),
      )
      .transp(createValidTransp())
      .pag(createValidPag());

    const entityOrLeft = builder.toObject();
    expectIsRight(entityOrLeft);

    const nfe = entityOrLeft.value;
    expect(nfe.infNFe.ide.tpEmis).toBe('9');
    expect(nfe.infNFe.ide.xJust).toBe('SEFAZ fora do Ar');
    expect(nfe.infNFe.ide.dhCont).toBe('2025-11-13T07:10:00-03:00');

    const accessKey = nfe.infNFe.$.Id?.replace('NFe', '');
    expectNotNull(accessKey);

    const decompiled = new AccessKeyBuilder().decompile(accessKey);
    expect(decompiled?.tpEmis).toBe('9');
  });

  it('should toggle to contingency when tpEmis="9" and both xJust and dhCont are provided', () => {
    const builder = NfceXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide({
        ...createValidIde(),
        tpEmis: TpEmis.OFFLINE,
        xJust: 'Contingência manual',
        dhCont: '2025-11-13T10:10:00Z',
      })
      .emit(createValidEmit())
      .det(createValidItems(), (ctx, item) =>
        ctx
          .prod({
            cProd: item.code,
            cEAN: 'SEM GTIN',
            xProd: item.description,
            NCM: '00',
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
          .icms({
            ICMS00: {
              orig: '1',
              CST: '00',
              modBC: '0',
              vBC: '100',
              pICMS: 18.0,
              vICMS: Decimal.from('18').toString(),
            },
          })
          .ipi({
            cEnq: '999',
            IPINT: {
              CST: '53',
            },
          })
          .pis({
            PISNT: {
              CST: '08',
            },
          })
          .cofins({
            COFINSNT: {
              CST: '08',
            },
          }),
      )
      .transp(createValidTransp())
      .pag(createValidPag());

    const entityOrLeft = builder.toObject();
    expectIsRight(entityOrLeft);

    const nfe = entityOrLeft.value;
    expect(nfe.infNFe.ide.tpEmis).toBe('9');
    expect(nfe.infNFe.ide.xJust).toBe('Contingência manual');
    expect(nfe.infNFe.ide.dhCont).toBe('2025-11-13T07:10:00-03:00');

    const accessKey = nfe.infNFe.$.Id?.replace('NFe', '');
    expectNotNull(accessKey);

    const decompiled = new AccessKeyBuilder().decompile(accessKey);
    expect(decompiled?.tpEmis).toBe('9');
  });
});
