import axios from 'axios';
import path from 'node:path';

import {
  XmlToolkit,
  ReadCertificateResponse,
  CertificateRepository,
  SignatureAlgorithm,
  NFeTsError,
} from '@nfets/core/domain';

import {
  Decimal,
  Xml2JsToolkit,
  NativeCertificateRepository,
  MemoryCacheAdapter,
} from '@nfets/core/infrastructure';

import {
  XmlSigner,
  SkipAllValidations,
  SkipValidation,
} from '@nfets/core/application';

import { NfeXmlBuilder } from '@nfets/nfe/application/xml-builder/nfe-xml-builder';
import { AccessKeyBuilder } from '@nfets/nfe/application/access-key/access-key-builder';

import type { Ide } from '@nfets/nfe/domain/entities/nfe/inf-nfe/ide';
import {
  createValidEmit,
  createValidIde,
  createValidItems,
  createValidPag,
  createValidTransp,
} from '../../../test/fixtures/data';
import {
  expectIsLeft,
  expectIsRight,
  expectNotNull,
} from '@nfets/test/expects';
import { getCnpjCertificate } from '@nfets/test/certificates';
import { getCertificatePassword } from '@nfets/test/certificates';
import { directory } from '@nfets/nfe/domain/entities/transmission/schemas';
import { TpEmis } from '@nfets/nfe/domain/entities/constants/tp-emis';

describe('xml builder with xml2js builder', () => {
  const toolkit: XmlToolkit = new Xml2JsToolkit();
  const nfeNfceSchemas = path.resolve(directory, 'PL_009_V4'),
    leiauteNFe4_00 = 'nfe_v4.00.xsd';

  const password = getCertificatePassword(),
    validCnpjPfxCertificate = getCnpjCertificate();

  let signer: XmlSigner;
  let certificate: ReadCertificateResponse;
  let certificateRepository: CertificateRepository;

  beforeAll(async () => {
    certificateRepository = new NativeCertificateRepository(
      axios.create(),
      new MemoryCacheAdapter(),
    );

    const certificateOrError = await certificateRepository.read({
      pfxPathOrBase64: validCnpjPfxCertificate,
      password,
    });

    signer = new XmlSigner(
      toolkit,
      certificateRepository,
      SignatureAlgorithm.SHA1,
    );

    if (certificateOrError.isLeft()) return;
    certificate = certificateOrError.value;
  });

  it('should completely ignores validations and sets the versao to [object Object]', async () => {
    @SkipAllValidations()
    class DontValidateNfeXmlBuilder extends NfeXmlBuilder {}

    const builder = DontValidateNfeXmlBuilder.create(toolkit)
      .infNFe({ versao: { some: 'invalid-value' } as never })
      .ide({
        mod: '55',
        serie: 1,
        nNF: 1,
        dhEmi: '2024-06-12T09:55:26+00:00',
        cUF: '52',
        tpEmis: '1',
        cNF: '45941728',
      } as never)
      .emit({} as never)
      .det([] as never, () => void 0 as never)
      .transp({} as never)
      .pag({} as never);

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240600000000000000550010000000011459417288" versao="[object Object]">
    <ide>
      <cUF>52</cUF>
      <cNF>45941728</cNF>
      <mod>55</mod>
      <serie>1</serie>
      <nNF>1</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <tpEmis>1</tpEmis>
      <cDV>8</cDV>
    </ide>
    <emit/>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>0.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>0.00</vNF>
      </ICMSTot>
    </total>
    <transp/>
    <pag/>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsLeft(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should ignores only one method validation and consequently gets a invalid xml...', async () => {
    class DontValidateNfeXmlBuilder extends NfeXmlBuilder {
      @SkipValidation()
      public ide(payload: Ide) {
        return super.ide(payload);
      }
    }

    const builder = DontValidateNfeXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide({
        mod: { invalid: 'model' } as never,
        dhEmi: '2024-06-12T09:55:26+00:00',
        serie: 1,
        nNF: 1,
        cUF: '52',
        tpEmis: '1',
        cNF: '12345678',
      } as never)
      .emit({ xNome: 'xD', IE: '', CRT: '' } as never)
      .det([] as never, () => void 0 as never)
      .transp({ modFrete: '9' })
      .pag({
        detPag: [{ tPag: '01', vPag: Decimal.from('100').toString() }],
      });

    const xml = await builder.assemble();
    expectIsRight(xml);

    expect(xml.value).toBeDefined();
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240600000000000000[object Object]001000000001112345678NaN" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>12345678</cNF>
      <mod>
        <invalid>model</invalid>
      </mod>
      <serie>1</serie>
      <nNF>1</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <tpEmis>1</tpEmis>
      <cDV>N</cDV>
    </ide>
    <emit>
      <xNome>xD</xNome>
      <IE/>
      <CRT/>
    </emit>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>0.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>0.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsLeft(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should throw exception when assemble an invalid nfe xml', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide({
        mod: '55',
        dhEmi: '2024-06-12T09:55:26+00:00',
        cUF: '52',
        serie: 1,
        nNF: 1,
        tpEmis: '1',
      } as never)
      .emit({} as never)
      .det([] as never, () => void 0 as never)
      .transp({ modFrete: '9' })
      .pag({
        detPag: [{ tPag: '01', vPag: Decimal.from('100').toString() }],
      });

    const xmlOrLeft = await builder.assemble();
    expectIsLeft(xmlOrLeft);
    expect(xmlOrLeft.value).toStrictEqual(
      new NFeTsError(
        'ide.cNF must be a string, ide.natOp must be a string, ide.serie must be a string, ide.nNF must be a string, ide.tpNF must be a string, ide.idDest must be a string, ide.cMunFG must be a string, ide.tpImp must be a string, ide.tpAmb must be a string, ide.finNFe must be a string, ide.indFinal must be a string, ide.indPres must be a string, ide.procEmi must be a string, ide.verProc must be a string, emit.xNome must be a string, emit.IE must be a string, emit.CRT must be a string',
      ),
    );
  });

  it('should build minimal NFe with only required elements', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
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

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain(
      '<NFe xmlns="http://www.portalfiscal.inf.br/nfe">',
    );
    expect(xml.value).toContain('<infNFe');
    expect(xml.value).toContain('<ide>');
    expect(xml.value).toContain('<emit>');
    expect(xml.value).toContain('<det nItem="1">');
    expect(xml.value).toContain('<total>');
    expect(xml.value).toContain('<transp>');
    expect(xml.value).toContain('<pag>');
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with avulsa element', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide(createValidIde())
      .emit(createValidEmit())
      .avulsa({
        CNPJ: '12345678000195',
        xOrgao: 'Receita Federal',
        matr: '123456',
        xAgente: 'João Silva',
        fone: '11999999999',
        UF: 'SP',
        nDAR: '123456789',
        vDAR: '100.00',
        repEmi: '123456789',
      })
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

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<avulsa>');
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <avulsa>
      <CNPJ>12345678000195</CNPJ>
      <xOrgao>Receita Federal</xOrgao>
      <matr>123456</matr>
      <xAgente>João Silva</xAgente>
      <fone>11999999999</fone>
      <UF>SP</UF>
      <nDAR>123456789</nDAR>
      <vDAR>100.00</vDAR>
      <repEmi>123456789</repEmi>
    </avulsa>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with dest element', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide(createValidIde())
      .emit(createValidEmit())
      .dest({
        CNPJ: '12345678000195',
        xNome: 'Cliente Destinatário',
        enderDest: {
          xLgr: 'Rua das Flores',
          nro: '123',
          xBairro: 'Centro',
          cMun: '3550308',
          xMun: 'São Paulo',
          UF: 'SP',
          CEP: '01234567',
          cPais: '1058',
          xPais: 'Brasil',
        },
        IE: '123456789',
        indIEDest: '1',
        email: 'cliente@email.com',
      })
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

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<dest>');
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <dest>
      <CNPJ>12345678000195</CNPJ>
      <xNome>NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL</xNome>
      <enderDest>
        <xLgr>Rua das Flores</xLgr>
        <nro>123</nro>
        <xBairro>Centro</xBairro>
        <cMun>3550308</cMun>
        <xMun>São Paulo</xMun>
        <UF>SP</UF>
        <CEP>01234567</CEP>
        <cPais>1058</cPais>
        <xPais>Brasil</xPais>
      </enderDest>
      <indIEDest>1</indIEDest>
      <IE>123456789</IE>
      <email>cliente@email.com</email>
    </dest>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with retirada element', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide(createValidIde())
      .emit(createValidEmit())
      .retirada({
        CNPJ: '12345678000195',
        xLgr: 'Rua de Retirada',
        nro: '456',
        xBairro: 'Centro',
        cMun: '3550308',
        xMun: 'São Paulo',
        UF: 'SP',
        CEP: '01234567',
        cPais: '1058',
        xPais: 'Brasil',
      })
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

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<retirada>');
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <retirada>
      <CNPJ>12345678000195</CNPJ>
      <xLgr>Rua de Retirada</xLgr>
      <nro>456</nro>
      <xBairro>Centro</xBairro>
      <cMun>3550308</cMun>
      <xMun>São Paulo</xMun>
      <UF>SP</UF>
      <CEP>01234567</CEP>
      <cPais>1058</cPais>
      <xPais>Brasil</xPais>
    </retirada>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with entrega element', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide(createValidIde())
      .emit(createValidEmit())
      .entrega({
        CNPJ: '12345678000195',
        xLgr: 'Rua de Entrega',
        nro: '789',
        xBairro: 'Centro',
        cMun: '3550308',
        xMun: 'São Paulo',
        UF: 'SP',
        CEP: '01234567',
        cPais: '1058',
        xPais: 'Brasil',
      })
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

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<entrega>');
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <entrega>
      <CNPJ>12345678000195</CNPJ>
      <xLgr>Rua de Entrega</xLgr>
      <nro>789</nro>
      <xBairro>Centro</xBairro>
      <cMun>3550308</cMun>
      <xMun>São Paulo</xMun>
      <UF>SP</UF>
      <CEP>01234567</CEP>
      <cPais>1058</cPais>
      <xPais>Brasil</xPais>
    </entrega>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with 2x autXML element', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide(createValidIde())
      .emit(createValidEmit())
      .autXML({
        CNPJ: '12345678000195',
      })
      .autXML({
        CPF: '12345678001',
      })
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

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<autXML>');
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <autXML>
      <CNPJ>12345678000195</CNPJ>
    </autXML>
    <autXML>
      <CPF>12345678001</CPF>
    </autXML>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with cobr element', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
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
      .cobr({
        fat: { nFat: 'NF-8018', vOrig: Decimal.from('100').toString() },
        dup: [
          {
            nDup: '1',
            dVenc: '2025-04-15',
            vDup: Decimal.from('100').toString(),
          },
        ],
      })
      .pag(createValidPag());

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<cobr>');
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <cobr>
      <fat>
        <nFat>NF-8018</nFat>
        <vOrig>100.00</vOrig>
      </fat>
      <dup>
        <nDup>1</nDup>
        <dVenc>2025-04-15</dVenc>
        <vDup>100.00</vDup>
      </dup>
    </cobr>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with infIntermed element after pag', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
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
      .pag(createValidPag())
      .infIntermed({
        CNPJ: '12345678000195',
        idCadIntTran: '123456',
      });

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<infIntermed>');
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
    <infIntermed>
      <CNPJ>12345678000195</CNPJ>
      <idCadIntTran>123456</idCadIntTran>
    </infIntermed>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with infAdic element after pag', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
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
      .pag(createValidPag())
      .infAdic({
        infAdFisco: 'Informações adicionais do fisco',
        infCpl: 'Informações complementares',
      });

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<infAdic>');
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
    <infAdic>
      <infAdFisco>Informações adicionais do fisco</infAdFisco>
      <infCpl>Informações complementares</infCpl>
    </infAdic>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with infSolicNFF element after pag', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
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
      .pag(createValidPag())
      .infSolicNFF({
        xSolic: 'Solicitação NFF',
      });

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<infSolicNFF>');
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
    <infSolicNFF>
      <xSolic>Solicitação NFF</xSolic>
    </infSolicNFF>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with cana element after pag', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
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
      .pag(createValidPag())
      .cana({
        safra: '2024/2025',
        ref: '06/2024',
        forDia: [
          {
            $: { dia: '1' },
            qtde: '1000.0000',
          },
        ],
        qTotMes: '1000.0000',
        qTotAnt: '0.0000',
        qTotGer: '1000.0000',
        deduc: [
          {
            xDed: 'Dedução 1',
            vDed: '100.00',
          },
        ],
        vFor: '1000.00',
        vTotDed: '100.00',
        vLiqFor: '900.00',
      });

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<cana>');
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
    <cana>
      <safra>2024/2025</safra>
      <ref>06/2024</ref>
      <forDia dia="1">
        <qtde>1000.0000</qtde>
      </forDia>
      <qTotMes>1000.0000</qTotMes>
      <qTotAnt>0.0000</qTotAnt>
      <qTotGer>1000.0000</qTotGer>
      <deduc>
        <xDed>Dedução 1</xDed>
        <vDed>100.00</vDed>
      </deduc>
      <vFor>1000.00</vFor>
      <vTotDed>100.00</vTotDed>
      <vLiqFor>900.00</vLiqFor>
    </cana>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with compra element after pag', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
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
      .pag(createValidPag())
      .compra({
        xNEmp: 'Nota de Empenho 123',
        xPed: 'Pedido 456',
        xCont: 'Contrato 789',
      });

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<compra>');
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
    <compra>
      <xNEmp>Nota de Empenho 123</xNEmp>
      <xPed>Pedido 456</xPed>
      <xCont>Contrato 789</xCont>
    </compra>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with exporta element after pag', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
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
      .pag(createValidPag())
      .exporta({
        UFSaidaPais: 'SP',
        xLocExporta: 'Porto de Santos',
        xLocDespacho: 'Aeroporto de Guarulhos',
      });

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<exporta>');
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
    <exporta>
      <UFSaidaPais>SP</UFSaidaPais>
      <xLocExporta>Porto de Santos</xLocExporta>
      <xLocDespacho>Aeroporto de Guarulhos</xLocDespacho>
    </exporta>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with infRespTec element after cana', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
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
      .pag(createValidPag())
      .cana({
        safra: '2024/2025',
        ref: '06/2024',
        forDia: [
          {
            $: { dia: '1' },
            qtde: '1000.0000',
          },
          {
            $: { dia: '2' },
            qtde: '1000.0000',
          },
        ],
        qTotMes: '1000.0000',
        qTotAnt: '0.0000',
        qTotGer: '1000.0000',
        deduc: [
          {
            xDed: 'Dedução 1',
            vDed: '100.00',
          },
        ],
        vFor: '1000.00',
        vTotDed: '100.00',
        vLiqFor: '900.00',
      })
      .infRespTec({
        CNPJ: '12345678000195',
        xContato: 'João Silva',
        email: 'joao@email.com',
        fone: '11999999999',
      });

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<infRespTec>');
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
    <cana>
      <safra>2024/2025</safra>
      <ref>06/2024</ref>
      <forDia dia="1">
        <qtde>1000.0000</qtde>
      </forDia>
      <forDia dia="2">
        <qtde>1000.0000</qtde>
      </forDia>
      <qTotMes>1000.0000</qTotMes>
      <qTotAnt>0.0000</qTotAnt>
      <qTotGer>1000.0000</qTotGer>
      <deduc>
        <xDed>Dedução 1</xDed>
        <vDed>100.00</vDed>
      </deduc>
      <vFor>1000.00</vFor>
      <vTotDed>100.00</vTotDed>
      <vLiqFor>900.00</vLiqFor>
    </cana>
    <infRespTec>
      <CNPJ>12345678000195</CNPJ>
      <xContato>João Silva</xContato>
      <email>joao@email.com</email>
      <fone>11999999999</fone>
    </infRespTec>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with multiple optional elements in correct order', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide(createValidIde())
      .emit(createValidEmit())
      .dest({
        CNPJ: '12345678000195',
        xNome: 'Cliente Destinatário',
        enderDest: {
          xLgr: 'Rua das Flores',
          nro: '123',
          xBairro: 'Centro',
          cMun: '3550308',
          xMun: 'São Paulo',
          UF: 'SP',
          CEP: '01234567',
          cPais: '1058',
          xPais: 'Brasil',
        },
        IE: '123456789',
        indIEDest: '1',
        email: 'cliente@email.com',
      })
      .retirada({
        CNPJ: '12345678000195',
        xLgr: 'Rua de Retirada',
        nro: '456',
        xBairro: 'Centro',
        cMun: '3550308',
        xMun: 'São Paulo',
        UF: 'SP',
        CEP: '01234567',
        cPais: '1058',
        xPais: 'Brasil',
      })
      .entrega({
        CNPJ: '12345678000195',
        xLgr: 'Rua de Entrega',
        nro: '789',
        xBairro: 'Centro',
        cMun: '3550308',
        xMun: 'São Paulo',
        UF: 'SP',
        CEP: '01234567',
        cPais: '1058',
        xPais: 'Brasil',
      })
      .autXML({
        CNPJ: '12345678000195',
      })
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
      .cobr({
        fat: { nFat: 'NF-8018', vOrig: Decimal.from('100').toString() },
        dup: [
          {
            nDup: '1',
            dVenc: '2025-04-15',
            vDup: Decimal.from('100').toString(),
          },
        ],
      })
      .pag(createValidPag())
      .infIntermed({
        CNPJ: '12345678000195',
        idCadIntTran: '123456',
      })
      .exporta({
        UFSaidaPais: 'SP',
        xLocExporta: 'Porto de Santos',
        xLocDespacho: 'Aeroporto de Guarulhos',
      })
      .infAdic({
        infAdFisco: 'Informações adicionais do fisco',
        infCpl: 'Informações complementares',
      })
      .compra({
        xNEmp: 'Nota de Empenho 123',
        xPed: 'Pedido 456',
        xCont: 'Contrato 789',
      })
      .cana({
        safra: '2024/2025',
        ref: '06/2024',
        forDia: [
          {
            $: { dia: '1' },
            qtde: '1000.0000',
          },
        ],
        qTotMes: '1000.0000',
        qTotAnt: '0.0000',
        qTotGer: '1000.0000',
        deduc: [
          {
            xDed: 'Dedução 1',
            vDed: '100.00',
          },
        ],
        vFor: '1000.00',
        vTotDed: '100.00',
        vLiqFor: '900.00',
      })
      .infRespTec({
        CNPJ: '12345678000195',
        xContato: 'João Silva',
        email: 'joao@email.com',
        fone: '11999999999',
      })
      .infSolicNFF({
        xSolic: 'Solicitação NFF',
      });

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();

    expect(xml.value).toContain('<infNFe');
    expect(xml.value).toContain('<ide>');
    expect(xml.value).toContain('<emit>');
    expect(xml.value).toContain('<dest>');
    expect(xml.value).toContain('<retirada>');
    expect(xml.value).toContain('<entrega>');
    expect(xml.value).toContain('<autXML>');
    expect(xml.value).toContain('<det nItem="1">');
    expect(xml.value).toContain('<total>');
    expect(xml.value).toContain('<transp>');
    expect(xml.value).toContain('<cobr>');
    expect(xml.value).toContain('<pag>');
    expect(xml.value).toContain('<infIntermed>');
    expect(xml.value).toContain('<infAdic>');
    expect(xml.value).toContain('<infSolicNFF>');
    expect(xml.value).toContain('<cana>');
    expect(xml.value).toContain('<compra>');
    expect(xml.value).toContain('<exporta>');
    expect(xml.value).toContain('<infRespTec>');
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <dest>
      <CNPJ>12345678000195</CNPJ>
      <xNome>NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL</xNome>
      <enderDest>
        <xLgr>Rua das Flores</xLgr>
        <nro>123</nro>
        <xBairro>Centro</xBairro>
        <cMun>3550308</cMun>
        <xMun>São Paulo</xMun>
        <UF>SP</UF>
        <CEP>01234567</CEP>
        <cPais>1058</cPais>
        <xPais>Brasil</xPais>
      </enderDest>
      <indIEDest>1</indIEDest>
      <IE>123456789</IE>
      <email>cliente@email.com</email>
    </dest>
    <retirada>
      <CNPJ>12345678000195</CNPJ>
      <xLgr>Rua de Retirada</xLgr>
      <nro>456</nro>
      <xBairro>Centro</xBairro>
      <cMun>3550308</cMun>
      <xMun>São Paulo</xMun>
      <UF>SP</UF>
      <CEP>01234567</CEP>
      <cPais>1058</cPais>
      <xPais>Brasil</xPais>
    </retirada>
    <entrega>
      <CNPJ>12345678000195</CNPJ>
      <xLgr>Rua de Entrega</xLgr>
      <nro>789</nro>
      <xBairro>Centro</xBairro>
      <cMun>3550308</cMun>
      <xMun>São Paulo</xMun>
      <UF>SP</UF>
      <CEP>01234567</CEP>
      <cPais>1058</cPais>
      <xPais>Brasil</xPais>
    </entrega>
    <autXML>
      <CNPJ>12345678000195</CNPJ>
    </autXML>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <cobr>
      <fat>
        <nFat>NF-8018</nFat>
        <vOrig>100.00</vOrig>
      </fat>
      <dup>
        <nDup>1</nDup>
        <dVenc>2025-04-15</dVenc>
        <vDup>100.00</vDup>
      </dup>
    </cobr>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
    <infIntermed>
      <CNPJ>12345678000195</CNPJ>
      <idCadIntTran>123456</idCadIntTran>
    </infIntermed>
    <infAdic>
      <infAdFisco>Informações adicionais do fisco</infAdFisco>
      <infCpl>Informações complementares</infCpl>
    </infAdic>
    <exporta>
      <UFSaidaPais>SP</UFSaidaPais>
      <xLocExporta>Porto de Santos</xLocExporta>
      <xLocDespacho>Aeroporto de Guarulhos</xLocDespacho>
    </exporta>
    <compra>
      <xNEmp>Nota de Empenho 123</xNEmp>
      <xPed>Pedido 456</xPed>
      <xCont>Contrato 789</xCont>
    </compra>
    <cana>
      <safra>2024/2025</safra>
      <ref>06/2024</ref>
      <forDia dia="1">
        <qtde>1000.0000</qtde>
      </forDia>
      <qTotMes>1000.0000</qTotMes>
      <qTotAnt>0.0000</qTotAnt>
      <qTotGer>1000.0000</qTotGer>
      <deduc>
        <xDed>Dedução 1</xDed>
        <vDed>100.00</vDed>
      </deduc>
      <vFor>1000.00</vFor>
      <vTotDed>100.00</vTotDed>
      <vLiqFor>900.00</vLiqFor>
    </cana>
    <infRespTec>
      <CNPJ>12345678000195</CNPJ>
      <xContato>João Silva</xContato>
      <email>joao@email.com</email>
      <fone>11999999999</fone>
    </infRespTec>
    <infSolicNFF>
      <xSolic>Solicitação NFF</xSolic>
    </infSolicNFF>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with infIntermed and infAdic after pag', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
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
      .pag(createValidPag())
      .infIntermed({
        CNPJ: '12345678000195',
        idCadIntTran: '123456',
      })
      .infAdic({
        infAdFisco: 'Informações adicionais do fisco',
        infCpl: 'Informações complementares',
      });

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<infIntermed>');
    expect(xml.value).toContain('<infAdic>');

    const infIntermedIndex = xml.value.indexOf('<infIntermed>');
    const infAdicIndex = xml.value.indexOf('<infAdic>');
    expect(infIntermedIndex).toBeLessThan(infAdicIndex);
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
    <infIntermed>
      <CNPJ>12345678000195</CNPJ>
      <idCadIntTran>123456</idCadIntTran>
    </infIntermed>
    <infAdic>
      <infAdFisco>Informações adicionais do fisco</infAdFisco>
      <infCpl>Informações complementares</infCpl>
    </infAdic>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with infIntermed and infSolicNFF after pag', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
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
      .pag(createValidPag())
      .infIntermed({
        CNPJ: '12345678000195',
        idCadIntTran: '123456',
      })
      .infSolicNFF({
        xSolic: 'Solicitação NFF',
      });

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<infIntermed>');
    expect(xml.value).toContain('<infSolicNFF>');

    const infIntermedIndex = xml.value.indexOf('<infIntermed>');
    const infSolicNFFIndex = xml.value.indexOf('<infSolicNFF>');
    expect(infIntermedIndex).toBeLessThan(infSolicNFFIndex);
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
    <infIntermed>
      <CNPJ>12345678000195</CNPJ>
      <idCadIntTran>123456</idCadIntTran>
    </infIntermed>
    <infSolicNFF>
      <xSolic>Solicitação NFF</xSolic>
    </infSolicNFF>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with infIntermed and cana after pag', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
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
      .pag(createValidPag())
      .infIntermed({
        CNPJ: '12345678000195',
        idCadIntTran: '123456',
      })
      .cana({
        safra: '2024/2025',
        ref: '06/2024',
        forDia: [
          {
            $: { dia: '1' },
            qtde: '1000.0000',
          },
        ],
        qTotMes: '1000.0000',
        qTotAnt: '0.0000',
        qTotGer: '1000.0000',
        deduc: [
          {
            xDed: 'Dedução 1',
            vDed: '100.00',
          },
        ],
        vFor: '1000.00',
        vTotDed: '100.00',
        vLiqFor: '900.00',
      });

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<infIntermed>');
    expect(xml.value).toContain('<cana>');

    const infIntermedIndex = xml.value.indexOf('<infIntermed>');
    const canaIndex = xml.value.indexOf('<cana>');
    expect(infIntermedIndex).toBeLessThan(canaIndex);
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
    <infIntermed>
      <CNPJ>12345678000195</CNPJ>
      <idCadIntTran>123456</idCadIntTran>
    </infIntermed>
    <cana>
      <safra>2024/2025</safra>
      <ref>06/2024</ref>
      <forDia dia="1">
        <qtde>1000.0000</qtde>
      </forDia>
      <qTotMes>1000.0000</qTotMes>
      <qTotAnt>0.0000</qTotAnt>
      <qTotGer>1000.0000</qTotGer>
      <deduc>
        <xDed>Dedução 1</xDed>
        <vDed>100.00</vDed>
      </deduc>
      <vFor>1000.00</vFor>
      <vTotDed>100.00</vTotDed>
      <vLiqFor>900.00</vLiqFor>
    </cana>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with infIntermed and compra after pag', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
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
      .pag(createValidPag())
      .infIntermed({
        CNPJ: '12345678000195',
        idCadIntTran: '123456',
      })
      .compra({
        xNEmp: 'Nota de Empenho 123',
        xPed: 'Pedido 456',
        xCont: 'Contrato 789',
      });

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<infIntermed>');
    expect(xml.value).toContain('<compra>');

    const infIntermedIndex = xml.value.indexOf('<infIntermed>');
    const compraIndex = xml.value.indexOf('<compra>');
    expect(infIntermedIndex).toBeLessThan(compraIndex);
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
    <infIntermed>
      <CNPJ>12345678000195</CNPJ>
      <idCadIntTran>123456</idCadIntTran>
    </infIntermed>
    <compra>
      <xNEmp>Nota de Empenho 123</xNEmp>
      <xPed>Pedido 456</xPed>
      <xCont>Contrato 789</xCont>
    </compra>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with infIntermed and exporta after pag', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
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
      .pag(createValidPag())
      .infIntermed({
        CNPJ: '12345678000195',
        idCadIntTran: '123456',
      })
      .exporta({
        UFSaidaPais: 'SP',
        xLocExporta: 'Porto de Santos',
        xLocDespacho: 'Aeroporto de Guarulhos',
      });

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<infIntermed>');
    expect(xml.value).toContain('<exporta>');

    const infIntermedIndex = xml.value.indexOf('<infIntermed>');
    const exportaIndex = xml.value.indexOf('<exporta>');
    expect(infIntermedIndex).toBeLessThan(exportaIndex);
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
    <infIntermed>
      <CNPJ>12345678000195</CNPJ>
      <idCadIntTran>123456</idCadIntTran>
    </infIntermed>
    <exporta>
      <UFSaidaPais>SP</UFSaidaPais>
      <xLocExporta>Porto de Santos</xLocExporta>
      <xLocDespacho>Aeroporto de Guarulhos</xLocDespacho>
    </exporta>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with infAdic and infSolicNFF after pag', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
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
      .pag(createValidPag())
      .infAdic({
        infAdFisco: 'Informações adicionais do fisco',
        infCpl: 'Informações complementares',
      })
      .infSolicNFF({
        xSolic: 'Solicitação NFF',
      });

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<infAdic>');
    expect(xml.value).toContain('<infSolicNFF>');

    const infAdicIndex = xml.value.indexOf('<infAdic>');
    const infSolicNFFIndex = xml.value.indexOf('<infSolicNFF>');
    expect(infAdicIndex).toBeLessThan(infSolicNFFIndex);
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
    <infAdic>
      <infAdFisco>Informações adicionais do fisco</infAdFisco>
      <infCpl>Informações complementares</infCpl>
    </infAdic>
    <infSolicNFF>
      <xSolic>Solicitação NFF</xSolic>
    </infSolicNFF>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with infAdic and cana after pag', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
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
      .pag(createValidPag())
      .infAdic({
        infAdFisco: 'Informações adicionais do fisco',
        infCpl: 'Informações complementares',
      })
      .cana({
        safra: '2024/2025',
        ref: '06/2024',
        forDia: [
          {
            $: { dia: '1' },
            qtde: '1000.0000',
          },
        ],
        qTotMes: '1000.0000',
        qTotAnt: '0.0000',
        qTotGer: '1000.0000',
        deduc: [
          {
            xDed: 'Dedução 1',
            vDed: '100.00',
          },
        ],
        vFor: '1000.00',
        vTotDed: '100.00',
        vLiqFor: '900.00',
      });

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<infAdic>');
    expect(xml.value).toContain('<cana>');

    const infAdicIndex = xml.value.indexOf('<infAdic>');
    const canaIndex = xml.value.indexOf('<cana>');
    expect(infAdicIndex).toBeLessThan(canaIndex);
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
    <infAdic>
      <infAdFisco>Informações adicionais do fisco</infAdFisco>
      <infCpl>Informações complementares</infCpl>
    </infAdic>
    <cana>
      <safra>2024/2025</safra>
      <ref>06/2024</ref>
      <forDia dia="1">
        <qtde>1000.0000</qtde>
      </forDia>
      <qTotMes>1000.0000</qTotMes>
      <qTotAnt>0.0000</qTotAnt>
      <qTotGer>1000.0000</qTotGer>
      <deduc>
        <xDed>Dedução 1</xDed>
        <vDed>100.00</vDed>
      </deduc>
      <vFor>1000.00</vFor>
      <vTotDed>100.00</vTotDed>
      <vLiqFor>900.00</vLiqFor>
    </cana>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with infAdic and compra after pag', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
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
      .pag(createValidPag())
      .infAdic({
        infAdFisco: 'Informações adicionais do fisco',
        infCpl: 'Informações complementares',
      })
      .compra({
        xNEmp: 'Nota de Empenho 123',
        xPed: 'Pedido 456',
        xCont: 'Contrato 789',
      });

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<infAdic>');
    expect(xml.value).toContain('<compra>');

    const infAdicIndex = xml.value.indexOf('<infAdic>');
    const compraIndex = xml.value.indexOf('<compra>');
    expect(infAdicIndex).toBeLessThan(compraIndex);
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
    <infAdic>
      <infAdFisco>Informações adicionais do fisco</infAdFisco>
      <infCpl>Informações complementares</infCpl>
    </infAdic>
    <compra>
      <xNEmp>Nota de Empenho 123</xNEmp>
      <xPed>Pedido 456</xPed>
      <xCont>Contrato 789</xCont>
    </compra>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with infAdic and exporta after pag', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
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
      .pag(createValidPag())
      .infAdic({
        infAdFisco: 'Informações adicionais do fisco',
        infCpl: 'Informações complementares',
      })
      .exporta({
        UFSaidaPais: 'SP',
        xLocExporta: 'Porto de Santos',
        xLocDespacho: 'Aeroporto de Guarulhos',
      });

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<infAdic>');
    expect(xml.value).toContain('<exporta>');

    const infAdicIndex = xml.value.indexOf('<infAdic>');
    const exportaIndex = xml.value.indexOf('<exporta>');
    expect(infAdicIndex).toBeLessThan(exportaIndex);
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
    <infAdic>
      <infAdFisco>Informações adicionais do fisco</infAdFisco>
      <infCpl>Informações complementares</infCpl>
    </infAdic>
    <exporta>
      <UFSaidaPais>SP</UFSaidaPais>
      <xLocExporta>Porto de Santos</xLocExporta>
      <xLocDespacho>Aeroporto de Guarulhos</xLocDespacho>
    </exporta>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with infSolicNFF and cana after pag', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
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
      .pag(createValidPag())
      .cana({
        safra: '2024/2025',
        ref: '06/2024',
        forDia: [
          {
            $: { dia: '1' },
            qtde: '1000.0000',
          },
        ],
        qTotMes: '1000.0000',
        qTotAnt: '0.0000',
        qTotGer: '1000.0000',
        deduc: [
          {
            xDed: 'Dedução 1',
            vDed: '100.00',
          },
        ],
        vFor: '1000.00',
        vTotDed: '100.00',
        vLiqFor: '900.00',
      })
      .infSolicNFF({
        xSolic: 'Solicitação NFF',
      });

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<infSolicNFF>');
    expect(xml.value).toContain('<cana>');

    const canaIndex = xml.value.indexOf('<cana>');
    const infSolicNFFIndex = xml.value.indexOf('<infSolicNFF>');
    expect(canaIndex).toBeLessThan(infSolicNFFIndex);
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
    <cana>
      <safra>2024/2025</safra>
      <ref>06/2024</ref>
      <forDia dia="1">
        <qtde>1000.0000</qtde>
      </forDia>
      <qTotMes>1000.0000</qTotMes>
      <qTotAnt>0.0000</qTotAnt>
      <qTotGer>1000.0000</qTotGer>
      <deduc>
        <xDed>Dedução 1</xDed>
        <vDed>100.00</vDed>
      </deduc>
      <vFor>1000.00</vFor>
      <vTotDed>100.00</vTotDed>
      <vLiqFor>900.00</vLiqFor>
    </cana>
    <infSolicNFF>
      <xSolic>Solicitação NFF</xSolic>
    </infSolicNFF>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with infSolicNFF and compra after pag', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
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
      .pag(createValidPag())
      .compra({
        xNEmp: 'Nota de Empenho 123',
        xPed: 'Pedido 456',
        xCont: 'Contrato 789',
      })
      .infSolicNFF({
        xSolic: 'Solicitação NFF',
      });

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<infSolicNFF>');
    expect(xml.value).toContain('<compra>');

    const compraIndex = xml.value.indexOf('<compra>');
    const infSolicNFFIndex = xml.value.indexOf('<infSolicNFF>');
    expect(compraIndex).toBeLessThan(infSolicNFFIndex);
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
    <compra>
      <xNEmp>Nota de Empenho 123</xNEmp>
      <xPed>Pedido 456</xPed>
      <xCont>Contrato 789</xCont>
    </compra>
    <infSolicNFF>
      <xSolic>Solicitação NFF</xSolic>
    </infSolicNFF>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with cana and compra after pag', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
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
      .pag(createValidPag())
      .compra({
        xNEmp: 'Nota de Empenho 123',
        xPed: 'Pedido 456',
        xCont: 'Contrato 789',
      })
      .cana({
        safra: '2024/2025',
        ref: '06/2024',
        forDia: [
          {
            $: { dia: '1' },
            qtde: '1000.0000',
          },
        ],
        qTotMes: '1000.0000',
        qTotAnt: '0.0000',
        qTotGer: '1000.0000',
        deduc: [
          {
            xDed: 'Dedução 1',
            vDed: '100.00',
          },
        ],
        vFor: '1000.00',
        vTotDed: '100.00',
        vLiqFor: '900.00',
      });

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<cana>');
    expect(xml.value).toContain('<compra>');

    const compraIndex = xml.value.indexOf('<compra>');
    const canaIndex = xml.value.indexOf('<cana>');
    expect(compraIndex).toBeLessThan(canaIndex);
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
    <compra>
      <xNEmp>Nota de Empenho 123</xNEmp>
      <xPed>Pedido 456</xPed>
      <xCont>Contrato 789</xCont>
    </compra>
    <cana>
      <safra>2024/2025</safra>
      <ref>06/2024</ref>
      <forDia dia="1">
        <qtde>1000.0000</qtde>
      </forDia>
      <qTotMes>1000.0000</qTotMes>
      <qTotAnt>0.0000</qTotAnt>
      <qTotGer>1000.0000</qTotGer>
      <deduc>
        <xDed>Dedução 1</xDed>
        <vDed>100.00</vDed>
      </deduc>
      <vFor>1000.00</vFor>
      <vTotDed>100.00</vTotDed>
      <vLiqFor>900.00</vLiqFor>
    </cana>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with cana and exporta after pag', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
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
      .pag(createValidPag())
      .exporta({
        UFSaidaPais: 'SP',
        xLocExporta: 'Porto de Santos',
        xLocDespacho: 'Aeroporto de Guarulhos',
      })
      .cana({
        safra: '2024/2025',
        ref: '06/2024',
        forDia: [
          {
            $: { dia: '1' },
            qtde: '1000.0000',
          },
        ],
        qTotMes: '1000.0000',
        qTotAnt: '0.0000',
        qTotGer: '1000.0000',
        deduc: [
          {
            xDed: 'Dedução 1',
            vDed: '100.00',
          },
        ],
        vFor: '1000.00',
        vTotDed: '100.00',
        vLiqFor: '900.00',
      });

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<cana>');
    expect(xml.value).toContain('<exporta>');

    const exportaIndex = xml.value.indexOf('<exporta>');
    const canaIndex = xml.value.indexOf('<cana>');
    expect(exportaIndex).toBeLessThan(canaIndex);
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
    <exporta>
      <UFSaidaPais>SP</UFSaidaPais>
      <xLocExporta>Porto de Santos</xLocExporta>
      <xLocDespacho>Aeroporto de Guarulhos</xLocDespacho>
    </exporta>
    <cana>
      <safra>2024/2025</safra>
      <ref>06/2024</ref>
      <forDia dia="1">
        <qtde>1000.0000</qtde>
      </forDia>
      <qTotMes>1000.0000</qTotMes>
      <qTotAnt>0.0000</qTotAnt>
      <qTotGer>1000.0000</qTotGer>
      <deduc>
        <xDed>Dedução 1</xDed>
        <vDed>100.00</vDed>
      </deduc>
      <vFor>1000.00</vFor>
      <vTotDed>100.00</vTotDed>
      <vLiqFor>900.00</vLiqFor>
    </cana>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with compra and exporta after pag', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
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
      .pag(createValidPag())
      .exporta({
        UFSaidaPais: 'SP',
        xLocExporta: 'Porto de Santos',
        xLocDespacho: 'Aeroporto de Guarulhos',
      })
      .compra({
        xNEmp: 'Nota de Empenho 123',
        xPed: 'Pedido 456',
        xCont: 'Contrato 789',
      });

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<compra>');
    expect(xml.value).toContain('<exporta>');

    const exportaIndex = xml.value.indexOf('<exporta>');
    const compraIndex = xml.value.indexOf('<compra>');
    expect(exportaIndex).toBeLessThan(compraIndex);
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
    <exporta>
      <UFSaidaPais>SP</UFSaidaPais>
      <xLocExporta>Porto de Santos</xLocExporta>
      <xLocDespacho>Aeroporto de Guarulhos</xLocDespacho>
    </exporta>
    <compra>
      <xNEmp>Nota de Empenho 123</xNEmp>
      <xPed>Pedido 456</xPed>
      <xCont>Contrato 789</xCont>
    </compra>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with cana and infRespTec after pag', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
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
      .pag(createValidPag())
      .cana({
        safra: '2024/2025',
        ref: '06/2024',
        forDia: [
          {
            $: { dia: '1' },
            qtde: '1000.0000',
          },
        ],
        qTotMes: '1000.0000',
        qTotAnt: '0.0000',
        qTotGer: '1000.0000',
        deduc: [
          {
            xDed: 'Dedução 1',
            vDed: '100.00',
          },
        ],
        vFor: '1000.00',
        vTotDed: '100.00',
        vLiqFor: '900.00',
      })
      .infRespTec({
        CNPJ: '12345678000195',
        xContato: 'João Silva',
        email: 'joao@email.com',
        fone: '11999999999',
      });

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<cana>');
    expect(xml.value).toContain('<infRespTec>');

    const canaIndex = xml.value.indexOf('<cana>');
    const infRespTecIndex = xml.value.indexOf('<infRespTec>');
    expect(canaIndex).toBeLessThan(infRespTecIndex);
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
    <cana>
      <safra>2024/2025</safra>
      <ref>06/2024</ref>
      <forDia dia="1">
        <qtde>1000.0000</qtde>
      </forDia>
      <qTotMes>1000.0000</qTotMes>
      <qTotAnt>0.0000</qTotAnt>
      <qTotGer>1000.0000</qTotGer>
      <deduc>
        <xDed>Dedução 1</xDed>
        <vDed>100.00</vDed>
      </deduc>
      <vFor>1000.00</vFor>
      <vTotDed>100.00</vTotDed>
      <vLiqFor>900.00</vLiqFor>
    </cana>
    <infRespTec>
      <CNPJ>12345678000195</CNPJ>
      <xContato>João Silva</xContato>
      <email>joao@email.com</email>
      <fone>11999999999</fone>
    </infRespTec>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with infSolicNFF, infAdic and avulsa after pag', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide(createValidIde())
      .emit(createValidEmit())
      .avulsa({
        CNPJ: '12345678000195',
        xOrgao: 'Receita Federal',
        matr: '123456',
        xAgente: 'João Silva',
        fone: '11999999999',
        UF: 'SP',
        nDAR: '123456789',
        vDAR: '100.00',
        repEmi: '123456789',
      })
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
      .pag(createValidPag())
      .infSolicNFF({
        xSolic: 'Solicitação NFF',
      })
      .infAdic({
        infAdFisco: 'Informações adicionais do fisco',
        infCpl: 'Informações complementares',
      });

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<infSolicNFF>');
    expect(xml.value).toContain('<infAdic>');
    expect(xml.value).toContain('<avulsa>');
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <avulsa>
      <CNPJ>12345678000195</CNPJ>
      <xOrgao>Receita Federal</xOrgao>
      <matr>123456</matr>
      <xAgente>João Silva</xAgente>
      <fone>11999999999</fone>
      <UF>SP</UF>
      <nDAR>123456789</nDAR>
      <vDAR>100.00</vDAR>
      <repEmi>123456789</repEmi>
    </avulsa>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
    <infAdic>
      <infAdFisco>Informações adicionais do fisco</infAdFisco>
      <infCpl>Informações complementares</infCpl>
    </infAdic>
    <infSolicNFF>
      <xSolic>Solicitação NFF</xSolic>
    </infSolicNFF>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build NFe with infRespTec, infAdic and avulsa after pag', async () => {
    const builder = NfeXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide(createValidIde())
      .emit(createValidEmit())
      .avulsa({
        CNPJ: '12345678000195',
        xOrgao: 'Receita Federal',
        matr: '123456',
        xAgente: 'João Silva',
        fone: '11999999999',
        UF: 'SP',
        nDAR: '123456789',
        vDAR: '100.00',
        repEmi: '123456789',
      })
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
      .pag(createValidPag())
      .infAdic({
        infAdFisco: 'Informações adicionais do fisco',
        infCpl: 'Informações complementares',
      })
      .infRespTec({
        CNPJ: '12345678000195',
        xContato: 'João Silva',
        email: 'joao@email.com',
        fone: '11999999999',
      });

    const xml = await builder.assemble();
    expectIsRight(xml);
    expect(xml.value).toBeDefined();
    expect(xml.value).toContain('<infRespTec>');
    expect(xml.value).toContain('<infAdic>');
    expect(xml.value).toContain('<avulsa>');
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <avulsa>
      <CNPJ>12345678000195</CNPJ>
      <xOrgao>Receita Federal</xOrgao>
      <matr>123456</matr>
      <xAgente>João Silva</xAgente>
      <fone>11999999999</fone>
      <UF>SP</UF>
      <nDAR>123456789</nDAR>
      <vDAR>100.00</vDAR>
      <repEmi>123456789</repEmi>
    </avulsa>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
    <infAdic>
      <infAdFisco>Informações adicionais do fisco</infAdFisco>
      <infCpl>Informações complementares</infCpl>
    </infAdic>
    <infRespTec>
      <CNPJ>12345678000195</CNPJ>
      <xContato>João Silva</xContato>
      <email>joao@email.com</email>
      <fone>11999999999</fone>
    </infRespTec>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should build a valid nfe xml with correct order and without undefined values', async () => {
    interface Item {
      description: string;
      code: string;
      price: number;
      quantity: number;
      unit: string;
      total: number;
    }

    const items = [
      {
        description: 'Product 1',
        code: '1',
        price: 100,
        quantity: 1,
        unit: 'UN',
        total: 100,
      },
    ] as [Item, ...Item[]];

    const builder = NfeXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide({
        cUF: '52',
        cNF: '78527251',
        natOp: 'Venda de mercadoria',
        mod: '55',
        serie: '99',
        nNF: '8018',
        dhEmi: '2024-06-12T09:55:26+00:00',
        dhSaiEnt: '2024-06-12T09:57:56+00:00',
        tpNF: '1',
        idDest: '2',
        cMunFG: '5212501',
        tpImp: '1',
        tpEmis: TpEmis.Normal,
        cDV: '5',
        tpAmb: '2',
        finNFe: '1',
        indFinal: '0',
        indPres: '1',
        procEmi: '0',
        verProc: 'nfets-0.0.1',
      })
      .emit({
        CRT: '1',
        xNome: 'cliente de goias',
        CNPJ: '46755763000143',
        xFant: 'cliente de goias',
        IM: '123748',
        CNAE: '1234567',
        IE: '109381599',
        enderEmit: {
          xLgr: '14 897',
          nro: '13897',
          fone: '4934420122',
          xCpl: 'teste teste',
          CEP: '72831770',
          xMun: 'Luziania',
          UF: 'GO',
          cMun: '5212501',
          cPais: '1058',
          xBairro: 'Residencial Copaibas',
          xPais: void 0,
        },
      })
      .det(items, (ctx, item) =>
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
      .transp({ modFrete: '9' })
      .cobr({
        fat: { nFat: 'NF-8018', vOrig: Decimal.from('100').toString() },
        dup: [
          {
            nDup: '1',
            dVenc: '2025-04-15',
            vDup: Decimal.from('100').toString(),
          },
        ],
      })
      .pag({
        detPag: [{ tPag: '01', vPag: Decimal.from('100').toString() }],
      });

    const xml = await builder.assemble();
    expectIsRight(xml);

    expect(xml.value).toBeDefined();
    expect(xml.value).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T09:55:26+00:00</dhEmi>
      <dhSaiEnt>2024-06-12T09:57:56+00:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Product 1</xProd>
        <NCM>00</NCM>
        <CFOP>5102</CFOP>
        <uCom>UN</uCom>
        <qCom>1.0000</qCom>
        <vUnCom>100.0000000000</vUnCom>
        <vProd>100.00</vProd>
        <cEANTrib>SEM GTIN</cEANTrib>
        <uTrib>UN</uTrib>
        <qTrib>1.0000</qTrib>
        <vUnTrib>100.0000000000</vUnTrib>
        <indTot>1</indTot>
      </prod>
      <imposto>
        <ICMS>
          <ICMS00>
            <orig>1</orig>
            <CST>00</CST>
            <modBC>0</modBC>
            <vBC>100.00</vBC>
            <pICMS>18.0000</pICMS>
            <vICMS>18.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>999</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISNT>
            <CST>08</CST>
          </PISNT>
        </PIS>
        <COFINS>
          <COFINSNT>
            <CST>08</CST>
          </COFINSNT>
        </COFINS>
      </imposto>
    </det>
    <total>
      <ICMSTot>
        <vBC>0.00</vBC>
        <vICMS>0.00</vICMS>
        <vICMSDeson>0.00</vICMSDeson>
        <vFCP>0.00</vFCP>
        <vBCST>0.00</vBCST>
        <vST>0.00</vST>
        <vFCPST>0.00</vFCPST>
        <vFCPSTRet>0.00</vFCPSTRet>
        <vProd>100.00</vProd>
        <vFrete>0.00</vFrete>
        <vSeg>0.00</vSeg>
        <vDesc>0.00</vDesc>
        <vII>0.00</vII>
        <vIPI>0.00</vIPI>
        <vIPIDevol>0.00</vIPIDevol>
        <vPIS>0.00</vPIS>
        <vCOFINS>0.00</vCOFINS>
        <vOutro>0.00</vOutro>
        <vNF>100.00</vNF>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <cobr>
      <fat>
        <nFat>NF-8018</nFat>
        <vOrig>100.00</vOrig>
      </fat>
      <dup>
        <nDup>1</nDup>
        <dVenc>2025-04-15</dVenc>
        <vDup>100.00</vDup>
      </dup>
    </cobr>
    <pag>
      <detPag>
        <tPag>01</tPag>
        <vPag>100.00</vPag>
      </detPag>
    </pag>
  </infNFe>
</NFe>`);

    const signed = await signer.sign(
      xml.value,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expectIsRight(
      await toolkit.validate(signed.value, nfeNfceSchemas, leiauteNFe4_00),
    );
  });

  it('should stay without contingency when tpEmis="1" and xJust is not provided and dhCont is not provided', () => {
    const builder = NfeXmlBuilder.create(toolkit)
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
    const builder = NfeXmlBuilder.create(toolkit)
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
    expect(nfe.infNFe.ide.tpEmis).toBe(TpEmis.SVCRS);
    expect(nfe.infNFe.ide.xJust).toBe('SEFAZ fora do Ar...');
    expect(nfe.infNFe.ide.dhCont).toBeDefined();

    const accessKey = nfe.infNFe.$.Id?.replace('NFe', '');
    expectNotNull(accessKey);

    const decompiled = new AccessKeyBuilder().decompile(accessKey);
    expect(decompiled?.tpEmis).toBe('7');
  });

  it('should toggle to contingency when tpEmis="1" and xJust is not provided and dhCont is provided', () => {
    const builder = NfeXmlBuilder.create(toolkit)
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
    expect(nfe.infNFe.ide.tpEmis).toBe(TpEmis.SVCRS);
    expect(nfe.infNFe.ide.xJust).toBe('SEFAZ fora do Ar');
    expect(nfe.infNFe.ide.dhCont).toBe('2025-11-13T10:00:00+00:00');

    const accessKey = nfe.infNFe.$.Id?.replace('NFe', '');
    expectNotNull(accessKey);

    const decompiled = new AccessKeyBuilder().decompile(accessKey);
    expect(decompiled?.tpEmis).toBe('7');
  });

  it('should toggle to contingency when tpEmis="1" and both xJust and dhCont are provided', () => {
    const builder = NfeXmlBuilder.create(toolkit)
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
    expect(nfe.infNFe.ide.tpEmis).toBe(TpEmis.SVCRS);
    expect(nfe.infNFe.ide.xJust).toBe('Contingência manual');
    expect(nfe.infNFe.ide.dhCont).toBe('2025-11-13T10:10:00+00:00');

    const accessKey = nfe.infNFe.$.Id?.replace('NFe', '');
    expectNotNull(accessKey);

    const decompiled = new AccessKeyBuilder().decompile(accessKey);
    expect(decompiled?.tpEmis).toBe('7');
  });

  it('should toggle to contingency when tpEmis="6" and xJust is not provided and dhCont is not provided', () => {
    const builder = NfeXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide({
        ...createValidIde(),
        tpEmis: TpEmis.SVCAN,
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
    expect(nfe.infNFe.ide.tpEmis).toBe('6');
    expect(nfe.infNFe.ide.xJust).toBe('SEFAZ fora do Ar');
    expect(nfe.infNFe.ide.dhCont).toBeDefined();

    const accessKey = nfe.infNFe.$.Id?.replace('NFe', '');
    expectNotNull(accessKey);

    const decompiled = new AccessKeyBuilder().decompile(accessKey);
    expect(decompiled?.tpEmis).toBe('6');
  });

  it('should toggle to contingency when tpEmis="6" and xJust is provided and dhCont is not provided', () => {
    const builder = NfeXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide({
        ...createValidIde(),
        tpEmis: TpEmis.SVCAN,
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
    expect(nfe.infNFe.ide.tpEmis).toBe('6');
    expect(nfe.infNFe.ide.xJust).toBe('SEFAZ fora do Ar...');
    expect(nfe.infNFe.ide.dhCont).toBeDefined();

    const accessKey = nfe.infNFe.$.Id?.replace('NFe', '');
    expectNotNull(accessKey);

    const decompiled = new AccessKeyBuilder().decompile(accessKey);
    expect(decompiled?.tpEmis).toBe('6');
  });

  it('should toggle to contingency when tpEmis="6" and xJust is not provided and dhCont is provided', () => {
    const builder = NfeXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide({
        ...createValidIde(),
        tpEmis: TpEmis.SVCAN,
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
    expect(nfe.infNFe.ide.tpEmis).toBe('6');
    expect(nfe.infNFe.ide.xJust).toBe('SEFAZ fora do Ar');
    expect(nfe.infNFe.ide.dhCont).toBe('2025-11-13T10:10:00+00:00');

    const accessKey = nfe.infNFe.$.Id?.replace('NFe', '');
    expectNotNull(accessKey);

    const decompiled = new AccessKeyBuilder().decompile(accessKey);
    expect(decompiled?.tpEmis).toBe('6');
  });

  it('should toggle to contingency when tpEmis="6" and both xJust and dhCont are provided', () => {
    const builder = NfeXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide({
        ...createValidIde(),
        tpEmis: TpEmis.SVCAN,
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
    expect(nfe.infNFe.ide.tpEmis).toBe('6');
    expect(nfe.infNFe.ide.xJust).toBe('Contingência manual');
    expect(nfe.infNFe.ide.dhCont).toBe('2025-11-13T10:10:00+00:00');

    const accessKey = nfe.infNFe.$.Id?.replace('NFe', '');
    expectNotNull(accessKey);

    const decompiled = new AccessKeyBuilder().decompile(accessKey);
    expect(decompiled?.tpEmis).toBe('6');
  });

  it('should toggle to contingency when tpEmis="7" and xJust is not provided and dhCont is not provided', () => {
    const builder = NfeXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide({
        ...createValidIde(),
        tpEmis: TpEmis.SVCRS,
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
    expect(nfe.infNFe.ide.tpEmis).toBe('7');
    expect(nfe.infNFe.ide.xJust).toBe('SEFAZ fora do Ar');
    expect(nfe.infNFe.ide.dhCont).toBeDefined();

    const accessKey = nfe.infNFe.$.Id?.replace('NFe', '');
    expectNotNull(accessKey);

    const decompiled = new AccessKeyBuilder().decompile(accessKey);
    expect(decompiled?.tpEmis).toBe('7');
  });

  it('should toggle to contingency when tpEmis="7" and xJust is provided and dhCont is not provided', () => {
    const builder = NfeXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide({
        ...createValidIde(),
        tpEmis: TpEmis.SVCRS,
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
    expect(nfe.infNFe.ide.tpEmis).toBe('7');
    expect(nfe.infNFe.ide.xJust).toBe('SEFAZ fora do Ar...');
    expect(nfe.infNFe.ide.dhCont).toBeDefined();

    const accessKey = nfe.infNFe.$.Id?.replace('NFe', '');
    expectNotNull(accessKey);

    const decompiled = new AccessKeyBuilder().decompile(accessKey);
    expect(decompiled?.tpEmis).toBe('7');
  });

  it('should toggle to contingency when tpEmis="7" and xJust is not provided and dhCont is provided', () => {
    const builder = NfeXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide({
        ...createValidIde(),
        tpEmis: TpEmis.SVCRS,
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
    expect(nfe.infNFe.ide.tpEmis).toBe('7');
    expect(nfe.infNFe.ide.xJust).toBe('SEFAZ fora do Ar');
    expect(nfe.infNFe.ide.dhCont).toBe('2025-11-13T10:10:00+00:00');

    const accessKey = nfe.infNFe.$.Id?.replace('NFe', '');
    expectNotNull(accessKey);

    const decompiled = new AccessKeyBuilder().decompile(accessKey);
    expect(decompiled?.tpEmis).toBe('7');
  });

  it('should toggle to contingency when tpEmis="7" and both xJust and dhCont are provided', () => {
    const builder = NfeXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide({
        ...createValidIde(),
        tpEmis: TpEmis.SVCRS,
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
    expect(nfe.infNFe.ide.tpEmis).toBe('7');
    expect(nfe.infNFe.ide.xJust).toBe('Contingência manual');
    expect(nfe.infNFe.ide.dhCont).toBe('2025-11-13T10:10:00+00:00');

    const accessKey = nfe.infNFe.$.Id?.replace('NFe', '');
    expectNotNull(accessKey);

    const decompiled = new AccessKeyBuilder().decompile(accessKey);
    expect(decompiled?.tpEmis).toBe('7');
  });
});
