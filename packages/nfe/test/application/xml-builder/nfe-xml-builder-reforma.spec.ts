import { Xml2JsToolkit, type XmlToolkit } from '@nfets/core';
import { ValidateErrorsMetadata } from '@nfets/core/application';
import { NfeXmlBuilder } from '@nfets/nfe/application/xml-builder/nfe-xml-builder';
import { TpEmis } from '@nfets/nfe/domain';
import Schemas from '@nfets/nfe/domain/entities/transmission/schemas';
import { expectIsLeft, expectIsRight } from '@nfets/test/expects';
import {
  createValidEmit,
  createValidIde,
  createValidItems,
  createValidPag,
  createValidTransp,
} from '../../fixtures/data';

describe('NfeXmlBuilder PL_010 and edge cases (unit)', () => {
  const toolkit: XmlToolkit = new Xml2JsToolkit();

  const buildMinimal = (
    schema:
      | (typeof Schemas)['PL_010_V1_30']
      | (typeof Schemas)['PL_009_V4'] = Schemas.PL_010_V1_30,
  ) =>
    NfeXmlBuilder.create(toolkit, undefined, schema)
      .infNFe({ versao: '4.00' })
      .ide(createValidIde())
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
              pICMS: '18.0000',
              vICMS: '18.00',
            },
          })
          .pis({ PISNT: { CST: '08' } })
          .cofins({ COFINSNT: { CST: '08' } })
          .vItem({ vItem: '100.00' }),
      )
      .transp(createValidTransp())
      .pag(createValidPag());

  it('should replace total when a payload is provided', () => {
    const builder = buildMinimal().total({
      ICMSTot: {
        vBC: '0.00',
        vICMS: '0.00',
        vICMSDeson: '0.00',
        vFCP: '0.00',
        vBCST: '0.00',
        vST: '0.00',
        vFCPST: '0.00',
        vFCPSTRet: '0.00',
        vProd: '10.00',
        vFrete: '0.00',
        vSeg: '0.00',
        vDesc: '0.00',
        vII: '0.00',
        vIPI: '0.00',
        vIPIDevol: '0.00',
        vPIS: '0.00',
        vCOFINS: '0.00',
        vOutro: '0.00',
        vNF: '10.00',
      },
    });

    expect(builder.data.infNFe.total.ICMSTot.vProd).toBe('10.00');
  });

  it('should ignore null total and reforma total payloads', () => {
    const builder = buildMinimal();

    expect(builder.total(undefined)).toBe(builder);
    expect(builder.ISSQNtot(undefined)).toBe(builder);
    expect(builder.ICMSTot(undefined)).toBe(builder);
    expect(builder.IBSCBSTot(undefined)).toBe(builder);
    expect(builder.ISTot(undefined)).toBe(builder);

    const result = builder.quiet().toObject();
    expectIsRight(result);
    expect(result.value.infNFe.total.ISTot).toBeUndefined();
  });

  it('should set agropecuario and infPAA on PL_010', () => {
    const builder = buildMinimal()
      .agropecuario({
        guiaTransito: {
          tpGuia: '1',
          UFGuia: 'GO',
          nGuia: '123',
        },
      })
      .infPAA({
        CNPJPAA: '00000000000191',
        PAASignature: {
          SignatureValue: 'c2ln',
          RSAKeyValue: {
            Modulus: 'bW9k',
            Exponent: 'AQAB',
          },
        },
      })
      .quiet();

    const result = builder.toObject();
    expectIsRight(result);
    expect(result.value.infNFe.agropecuario?.guiaTransito?.nGuia).toBe('123');
    expect(result.value.infNFe.infPAA?.CNPJPAA).toBe('00000000000191');
  });

  it('should ignore null agropecuario and infPAA payloads', () => {
    const builder = buildMinimal()
      .agropecuario(undefined)
      .infPAA(undefined)
      .quiet();

    const result = builder.toObject();
    expectIsRight(result);
    expect(result.value.infNFe.agropecuario).toBeUndefined();
    expect(result.value.infNFe.infPAA).toBeUndefined();
  });

  it('should merge gMono and gEstornoCred through PL_010 total increment', () => {
    const builder = buildMinimal()
      .IBSCBSTot({
        vBCIBSCBS: '100.00',
        gMono: {
          vIBSMono: '1.00',
          vCBSMono: '2.00',
        },
        gEstornoCred: {
          vIBSEstCred: '0.10',
          vCBSEstCred: '0.20',
        },
      })
      .ISTot({ vIS: '0.50' })
      .quiet();

    const result = builder.toObject();
    expectIsRight(result);
    expect(result.value.infNFe.total.IBSCBSTot?.gMono?.vIBSMono).toBe('1.00');
    expect(result.value.infNFe.total.IBSCBSTot?.gEstornoCred?.vCBSEstCred).toBe(
      '0.20',
    );
    expect(result.value.infNFe.total.ISTot?.vIS).toBe('0.50');
    expect(result.value.infNFe.total.vNFTot).toBe('100.00');
  });

  it('should toggle to SVCAN when contingency is inferred for SP', () => {
    const builder = NfeXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide({
        ...createValidIde(),
        cUF: '35',
        tpEmis: TpEmis.Normal,
        xJust: 'SEFAZ fora do Ar',
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
              pICMS: '18.0000',
              vICMS: '18.00',
            },
          })
          .pis({ PISNT: { CST: '08' } })
          .cofins({ COFINSNT: { CST: '08' } }),
      )
      .transp(createValidTransp())
      .pag(createValidPag())
      .quiet();

    const result = builder.toObject();
    expectIsRight(result);
    expect(result.value.infNFe.ide.tpEmis).toBe(TpEmis.SVCAN);
  });

  it('should collect validation errors from det builders', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide(createValidIde())
      .emit(createValidEmit())
      .det(createValidItems(), (ctx) =>
        ctx.prod({} as never).icms({
          ICMS00: {
            orig: '1',
            CST: '00',
            modBC: '0',
            vBC: '100',
            pICMS: '18.0000',
            vICMS: '18.00',
          },
        }),
      )
      .transp(createValidTransp())
      .pag(createValidPag());

    const xml = await builder.assemble();
    expectIsLeft(xml);
    expect(String(xml.value)).toContain('prod.');
  });

  it('should append det validation errors onto existing builder errors', async () => {
    const builder = NfeXmlBuilder.create(toolkit);
    Reflect.defineMetadata(ValidateErrorsMetadata, ['seed.error'], builder);

    builder
      .infNFe({ versao: '4.00' })
      .ide(createValidIde())
      .emit(createValidEmit())
      .det(createValidItems(), (ctx) =>
        ctx.prod({} as never).icms({
          ICMS00: {
            orig: '1',
            CST: '00',
            modBC: '0',
            vBC: '100',
            pICMS: '18.0000',
            vICMS: '18.00',
          },
        }),
      )
      .transp(createValidTransp())
      .pag(createValidPag());

    const xml = await builder.assemble();
    expectIsLeft(xml);
    expect(String(xml.value)).toContain('seed.error');
    expect(String(xml.value)).toContain('prod.');
  });

  it('should validate IBSCBSTot and ISTot when error metadata already exists', () => {
    const builder = buildMinimal();
    Reflect.defineMetadata(ValidateErrorsMetadata, ['prior.error'], builder);

    builder.IBSCBSTot({
      vBCIBSCBS: '100.00',
      gIBS: {
        vIBS: '1.00',
        vCredPres: '0.00',
        vCredPresCondSus: '0.00',
        gIBSUF: { vDif: '0.00', vDevTrib: '0.00', vIBSUF: '0.10' },
        gIBSMun: { vDif: '0.00', vDevTrib: '0.00', vIBSMun: '0.00' },
      },
      gCBS: {
        vDif: '0.00',
        vDevTrib: '0.00',
        vCBS: '0.90',
        vCredPres: '0.00',
        vCredPresCondSus: '0.00',
      },
    });
    builder.ISTot({ vIS: '1.00' });

    expect(builder.data.infNFe.total.IBSCBSTot?.vBCIBSCBS).toBe('100.00');
    expect(builder.data.infNFe.total.ISTot?.vIS).toBe('1.00');
  });

  it('should short-circuit optional fluent methods when payload is null', () => {
    const builder = buildMinimal();

    expect(builder.avulsa(undefined)).toBe(builder);
    expect(builder.dest(undefined)).toBe(builder);
    expect(builder.retirada(undefined)).toBe(builder);
    expect(builder.entrega(undefined)).toBe(builder);
    expect(builder.autXML(undefined)).toBe(builder);
    expect(builder.transp(undefined)).toBe(builder);
    expect(builder.cobr(undefined)).toBe(builder);
    expect(builder.pag(undefined)).toBe(builder);
    expect(builder.infIntermed(undefined)).toBe(builder);
    expect(builder.infAdic(undefined)).toBe(builder);
    expect(builder.exporta(undefined)).toBe(builder);
    expect(builder.compra(undefined)).toBe(builder);
    expect(builder.cana(undefined)).toBe(builder);
    expect(builder.infRespTec(undefined)).toBe(builder);
    expect(builder.infSolicNFF(undefined)).toBe(builder);
  });

  it('should reuse cached entity on subsequent toObject calls', () => {
    const builder = buildMinimal().quiet();
    const first = builder.toObject();
    expectIsRight(first);

    const second = builder.toObject();
    expectIsRight(second);
    expect(second.value).toBe(first.value);
  });

  it('should default schema when constructor omits it', () => {
    class ExposedNfeXmlBuilder extends NfeXmlBuilder {
      public constructor(builder: XmlToolkit) {
        super(builder);
      }
    }

    expect(new ExposedNfeXmlBuilder(toolkit).schema).toBe('PL_009_V4');
  });
});
