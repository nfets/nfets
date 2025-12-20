import axios from 'axios';

import { XmlSigner } from '../../../src/application/signer/xml-signer';
import { NFeTsError, Xml2JsToolkit } from '@nfets/core/index';
import { ensureIntegrationTestsHasValidCertificate } from '@nfets/test/ensure-integration-tests';
import { SignatureAlgorithm } from '@nfets/core/domain/entities/signer/algo';
import { NativeCertificateRepository } from '@nfets/core/infrastructure/repositories/native-certificate-repository';
import { MemoryCacheAdapter } from '@nfets/core/infrastructure/repositories/memory-cache-adapter';
import type { ReadCertificateResponse } from '@nfets/core/domain/entities/certificate/certificate';
import {
  getCertificatePassword,
  getCnpjCertificate,
} from '@nfets/test/certificates';
import type { CertificateRepository } from '@nfets/core/domain/repositories/certificate-repository';
import type { XmlToolkit } from '@nfets/core/domain/entities/xml/xml-toolkit';

import { expectIsLeft, expectIsRight } from '@nfets/test/expects';
import { CryptoSignerRepository } from '@nfets/core/infrastructure/repositories/crypto-signer-repository';

describe('xml signer (integration)', () => {
  let certificate: ReadCertificateResponse | undefined;
  const toolkit: XmlToolkit = new Xml2JsToolkit();
  let certificateRepository: CertificateRepository;
  const signerRepository = new CryptoSignerRepository();

  const cert = ensureIntegrationTestsHasValidCertificate();
  if (cert === undefined) return;

  beforeAll(async () => {
    certificateRepository = new NativeCertificateRepository(
      axios.create(),
      signerRepository,
      new MemoryCacheAdapter(),
    );

    const certificateOrError = await certificateRepository.read({
      pfxPathOrBase64: cert.certificatePath,
      password: cert.password,
    });

    if (certificateOrError.isLeft()) return;
    certificate = certificateOrError.value;
  });

  it('should return left when node is not found', async () => {
    if (certificate === undefined) return;
    const signer = new XmlSigner(
      toolkit,
      certificateRepository,
      SignatureAlgorithm.SHA1,
    );

    const signature = await signer.sign(
      '<test/>',
      { tag: 'test', mark: 'root' },
      certificate,
    );

    expectIsLeft(signature);
    expect(signature.value).toStrictEqual(
      new NFeTsError('Node test not found'),
    );
  });
});

describe('xml signer (unit)', () => {
  const password = getCertificatePassword(),
    validCnpjPfxCertificate = getCnpjCertificate();

  const toolkit: XmlToolkit = new Xml2JsToolkit();
  let certificate: ReadCertificateResponse | undefined;
  let certificateRepository: CertificateRepository;
  const signerRepository = new CryptoSignerRepository();

  beforeAll(async () => {
    certificateRepository = new NativeCertificateRepository(
      axios.create(),
      signerRepository,
      new MemoryCacheAdapter(),
    );

    const certificateOrError = await certificateRepository.read({
      pfxPathOrBase64: validCnpjPfxCertificate,
      password,
    });

    if (certificateOrError.isLeft()) return;
    certificate = certificateOrError.value;
  });

  it('should generate a valid SHA1 signature', async () => {
    if (certificate === undefined) return;

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe42250903916076000583550560000005651509037627" versao="4.00">
    <ide>
      <cUF>42</cUF>
      <cNF>50903762</cNF>
      <natOp>5102 - Venda de mercadoria adquirida ou recebida de terceiro</natOp>
      <mod>55</mod>
      <serie>56</serie>
      <nNF>565</nNF>
      <dhEmi>2025-09-30T07:18:47-03:00</dhEmi>
      <dhSaiEnt>2025-09-30T07:26:17-03:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>1</idDest>
      <cMunFG>4204301</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>7</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>1</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>3.22.8</verProc>
    </ide>
    <emit>
      <CNPJ>03916076000583</CNPJ>
      <xNome>devszweb@zucchetti.com</xNome>
      <xFant>devszweb@zucchetti.comu</xFant>
      <enderEmit>
        <xLgr>Travessa Nazareno Brusco</xLgr>
        <nro>S/N</nro>
        <xCpl>teste</xCpl>
        <xBairro>Centro</xBairro>
        <cMun>4204301</cMun>
        <xMun>Concordia</xMun>
        <UF>SC</UF>
        <CEP>89700903</CEP>
        <cPais>1058</cPais>
        <xPais>BRASIL</xPais>
        <fone>99999999999</fone>
      </enderEmit>
      <IE>261471520</IE>
      <IM>1234</IM>
      <CRT>3</CRT>
    </emit>
    <dest>
      <CPF>88872489075</CPF>
      <xNome>NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL</xNome>
      <enderDest>
        <xLgr>Travessa Nazareno Brusco</xLgr>
        <nro>80</nro>
        <xCpl>Nao informado</xCpl>
        <xBairro>Centro</xBairro>
        <cMun>4204301</cMun>
        <xMun>Concordia</xMun>
        <UF>SC</UF>
        <CEP>89700903</CEP>
        <cPais>1058</cPais>
        <xPais>BRASIL</xPais>
      </enderDest>
      <indIEDest>9</indIEDest>
      <email>88872489075cpf@melimail.com.br</email>
    </dest>
    <autXML>
      <CNPJ>03916076000583</CNPJ>
    </autXML>
    <autXML>
      <CNPJ>01605538000192</CNPJ>
    </autXML>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Produto Teste</xProd>
        <NCM>00000000</NCM>
        <CEST>0104300</CEST>
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
        <vTotTrib>14.85</vTotTrib>
        <ICMS>
          <ICMS00>
            <orig>0</orig>
            <CST>00</CST>
            <modBC>3</modBC>
            <vBC>100.00</vBC>
            <pICMS>7.0000</pICMS>
            <vICMS>7.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>126</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISOutr>
            <CST>99</CST>
            <vBC>0.00</vBC>
            <pPIS>0.0000</pPIS>
            <vPIS>0.00</vPIS>
          </PISOutr>
        </PIS>
        <COFINS>
          <COFINSOutr>
            <CST>99</CST>
            <vBC>0.00</vBC>
            <pCOFINS>0.0000</pCOFINS>
            <vCOFINS>0.00</vCOFINS>
          </COFINSOutr>
        </COFINS>
      </imposto>
      <infAdProd>Tem observacao</infAdProd>
    </det>
    <total>
      <ICMSTot>
        <vBC>100.00</vBC>
        <vICMS>7.00</vICMS>
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
        <vTotTrib>14.85</vTotTrib>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <cobr>
      <fat>
        <nFat>565</nFat>
        <vOrig>70.00</vOrig>
        <vDesc>0.00</vDesc>
        <vLiq>70.00</vLiq>
      </fat>
      <dup>
        <nDup>001</nDup>
        <dVenc>2025-09-30</dVenc>
        <vDup>20.00</vDup>
      </dup>
      <dup>
        <nDup>002</nDup>
        <dVenc>2025-10-30</dVenc>
        <vDup>5.00</vDup>
      </dup>
      <dup>
        <nDup>003</nDup>
        <dVenc>2025-10-30</dVenc>
        <vDup>20.00</vDup>
      </dup>
      <dup>
        <nDup>004</nDup>
        <dVenc>2025-11-30</dVenc>
        <vDup>5.00</vDup>
      </dup>
      <dup>
        <nDup>005</nDup>
        <dVenc>2025-11-30</dVenc>
        <vDup>20.00</vDup>
      </dup>
    </cobr>
    <pag>
      <detPag>
        <indPag>0</indPag>
        <tPag>01</tPag>
        <vPag>10.00</vPag>
      </detPag>
      <detPag>
        <indPag>1</indPag>
        <tPag>17</tPag>
        <vPag>20.00</vPag>
        <card>
          <tpIntegra>2</tpIntegra>
          <CNPJ>04962772000165</CNPJ>
          <cAut>2452</cAut>
        </card>
      </detPag>
      <detPag>
        <indPag>1</indPag>
        <tPag>05</tPag>
        <vPag>40.00</vPag>
      </detPag>
      <detPag>
        <indPag>1</indPag>
        <tPag>03</tPag>
        <vPag>10.00</vPag>
        <card>
          <tpIntegra>2</tpIntegra>
          <CNPJ>16501555000157</CNPJ>
          <tBand>99</tBand>
          <cAut>23423</cAut>
        </card>
      </detPag>
      <detPag>
        <indPag>1</indPag>
        <tPag>02</tPag>
        <vPag>20.00</vPag>
      </detPag>
    </pag>
    <infAdic>
      <infCpl>TESTE</infCpl>
    </infAdic>
    <infRespTec>
      <CNPJ>03916076000400</CNPJ>
      <xContato>Bernardo Rachadel Junior</xContato>
      <email>bernardo.rachadel@zucchetti.com</email>
      <fone>4934420122</fone>
    </infRespTec>
  </infNFe>
</NFe>`;

    const signer = new XmlSigner(
      toolkit,
      certificateRepository,
      SignatureAlgorithm.SHA1,
    );

    const signed = await signer.sign(
      xml,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expect(signed.value).toBeDefined();

    const expectedDigestValue = 'A9/PSfUleTqioYO54CxLUvI1rog=';
    expect(signed.value).toContain(
      `<DigestValue>${expectedDigestValue}</DigestValue>`,
    );

    const expectedSignatureValue =
      'f/hhwH8mtfmUKEuDv4XhpL66fHycdj//jXmsz0TFKfZgZ9aHhIo313RxxTzqOUE9etomSjwlosDl9SbQKf5Fr/W0uEW6r4vcppkGjWh071VfJSdtHX0jKCk4FjzNLOLuHO5W3ToQD0D/sSrMZLGAD6yRQTXebeCek/MdBqzXyoDoWY3XOPmmv1utYLEEf/43ZOEC8fSzCufrcIusjF+gHbca7A9h28+qd+/VIcTj3f9kXcOAItUO/UiPvGtEhbpVduih9uzpvxQKn7IDritCbRJmIMdJRVLW8Ntf4oTZ21DwHkyX/cNtrkPI2PmA+gsPGBU+0uLgnkmjOCK2LoROrQ==';
    expect(signed.value).toContain(
      `<SignatureValue>${expectedSignatureValue}</SignatureValue>`,
    );

    const expectedSignatureMetadata = `<Signature xmlns="http://www.w3.org/2000/09/xmldsig#"><SignedInfo><CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/><SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/><Reference URI="#NFe42250903916076000583550560000005651509037627"><Transforms><Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/><Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/></Transforms><DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>`;
    expect(signed.value).toContain(expectedSignatureMetadata);

    const expectedInfNFeGroup = xml
      .replace(/(>)\s*(<)/gm, '$1$2')
      .replace('</NFe>', '')
      .replace(
        `<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">`,
        '',
      );

    expect(signed.value).toContain(expectedInfNFeGroup);
  });

  it('should generate a valid SHA256 signature', async () => {
    if (certificate === undefined) return;

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe42250903916076000583550560000005651509037627" versao="4.00">
    <ide>
      <cUF>42</cUF>
      <cNF>50903762</cNF>
      <natOp>5102 - Venda de mercadoria adquirida ou recebida de terceiro</natOp>
      <mod>55</mod>
      <serie>56</serie>
      <nNF>565</nNF>
      <dhEmi>2025-09-30T07:18:47-03:00</dhEmi>
      <dhSaiEnt>2025-09-30T07:26:17-03:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>1</idDest>
      <cMunFG>4204301</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>7</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>1</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>3.22.8</verProc>
    </ide>
    <emit>
      <CNPJ>03916076000583</CNPJ>
      <xNome>devszweb@zucchetti.com</xNome>
      <xFant>devszweb@zucchetti.comu</xFant>
      <enderEmit>
        <xLgr>Travessa Nazareno Brusco</xLgr>
        <nro>S/N</nro>
        <xCpl>teste</xCpl>
        <xBairro>Centro</xBairro>
        <cMun>4204301</cMun>
        <xMun>Concordia</xMun>
        <UF>SC</UF>
        <CEP>89700903</CEP>
        <cPais>1058</cPais>
        <xPais>BRASIL</xPais>
        <fone>99999999999</fone>
      </enderEmit>
      <IE>261471520</IE>
      <IM>1234</IM>
      <CRT>3</CRT>
    </emit>
    <dest>
      <CPF>88872489075</CPF>
      <xNome>NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL</xNome>
      <enderDest>
        <xLgr>Travessa Nazareno Brusco</xLgr>
        <nro>80</nro>
        <xCpl>Nao informado</xCpl>
        <xBairro>Centro</xBairro>
        <cMun>4204301</cMun>
        <xMun>Concordia</xMun>
        <UF>SC</UF>
        <CEP>89700903</CEP>
        <cPais>1058</cPais>
        <xPais>BRASIL</xPais>
      </enderDest>
      <indIEDest>9</indIEDest>
      <email>88872489075cpf@melimail.com.br</email>
    </dest>
    <autXML>
      <CNPJ>03916076000583</CNPJ>
    </autXML>
    <autXML>
      <CNPJ>01605538000192</CNPJ>
    </autXML>
    <det nItem="1">
      <prod>
        <cProd>1</cProd>
        <cEAN>SEM GTIN</cEAN>
        <xProd>Produto Teste</xProd>
        <NCM>00000000</NCM>
        <CEST>0104300</CEST>
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
        <vTotTrib>14.85</vTotTrib>
        <ICMS>
          <ICMS00>
            <orig>0</orig>
            <CST>00</CST>
            <modBC>3</modBC>
            <vBC>100.00</vBC>
            <pICMS>7.0000</pICMS>
            <vICMS>7.00</vICMS>
          </ICMS00>
        </ICMS>
        <IPI>
          <cEnq>126</cEnq>
          <IPINT>
            <CST>53</CST>
          </IPINT>
        </IPI>
        <PIS>
          <PISOutr>
            <CST>99</CST>
            <vBC>0.00</vBC>
            <pPIS>0.0000</pPIS>
            <vPIS>0.00</vPIS>
          </PISOutr>
        </PIS>
        <COFINS>
          <COFINSOutr>
            <CST>99</CST>
            <vBC>0.00</vBC>
            <pCOFINS>0.0000</pCOFINS>
            <vCOFINS>0.00</vCOFINS>
          </COFINSOutr>
        </COFINS>
      </imposto>
      <infAdProd>Tem observacao</infAdProd>
    </det>
    <total>
      <ICMSTot>
        <vBC>100.00</vBC>
        <vICMS>7.00</vICMS>
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
        <vTotTrib>14.85</vTotTrib>
      </ICMSTot>
    </total>
    <transp>
      <modFrete>9</modFrete>
    </transp>
    <cobr>
      <fat>
        <nFat>565</nFat>
        <vOrig>70.00</vOrig>
        <vDesc>0.00</vDesc>
        <vLiq>70.00</vLiq>
      </fat>
      <dup>
        <nDup>001</nDup>
        <dVenc>2025-09-30</dVenc>
        <vDup>20.00</vDup>
      </dup>
      <dup>
        <nDup>002</nDup>
        <dVenc>2025-10-30</dVenc>
        <vDup>5.00</vDup>
      </dup>
      <dup>
        <nDup>003</nDup>
        <dVenc>2025-10-30</dVenc>
        <vDup>20.00</vDup>
      </dup>
      <dup>
        <nDup>004</nDup>
        <dVenc>2025-11-30</dVenc>
        <vDup>5.00</vDup>
      </dup>
      <dup>
        <nDup>005</nDup>
        <dVenc>2025-11-30</dVenc>
        <vDup>20.00</vDup>
      </dup>
    </cobr>
    <pag>
      <detPag>
        <indPag>0</indPag>
        <tPag>01</tPag>
        <vPag>10.00</vPag>
      </detPag>
      <detPag>
        <indPag>1</indPag>
        <tPag>17</tPag>
        <vPag>20.00</vPag>
        <card>
          <tpIntegra>2</tpIntegra>
          <CNPJ>04962772000165</CNPJ>
          <cAut>2452</cAut>
        </card>
      </detPag>
      <detPag>
        <indPag>1</indPag>
        <tPag>05</tPag>
        <vPag>40.00</vPag>
      </detPag>
      <detPag>
        <indPag>1</indPag>
        <tPag>03</tPag>
        <vPag>10.00</vPag>
        <card>
          <tpIntegra>2</tpIntegra>
          <CNPJ>16501555000157</CNPJ>
          <tBand>99</tBand>
          <cAut>23423</cAut>
        </card>
      </detPag>
      <detPag>
        <indPag>1</indPag>
        <tPag>02</tPag>
        <vPag>20.00</vPag>
      </detPag>
    </pag>
    <infAdic>
      <infCpl>TESTE</infCpl>
    </infAdic>
    <infRespTec>
      <CNPJ>03916076000400</CNPJ>
      <xContato>Bernardo Rachadel Junior</xContato>
      <email>bernardo.rachadel@zucchetti.com</email>
      <fone>4934420122</fone>
    </infRespTec>
  </infNFe>
</NFe>`;

    const signer = new XmlSigner(
      toolkit,
      certificateRepository,
      SignatureAlgorithm.SHA256,
    );

    const signed = await signer.sign(
      xml,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expect(signed.value).toBeDefined();

    const expectedDigestValue = '+NEx5Zf3sdjuyKh5FQfJc7G1uT/R2SxM8c7CTOle8BM=';
    expect(signed.value).toContain(
      `<DigestValue>${expectedDigestValue}</DigestValue>`,
    );

    const expectedSignatureValue =
      'jXYzNxaJ9kkZa0I+conWKMpQADC6hgsu1C+Wra+BcoUZllmjfxQzx74PjaDCABvSgMH9cjcCuO64TelcIce3m8iwx1MY6Z4u3ZSQHgNcHYzfc0/iFEXnqw2oHkzKMCuw/FVMBSrHyxGM+nzbSB27iLhVqLuz9gyZIjhNPdFkcsLqOG5CNM8mftbFeejiJO1rFuVSjHa1uX3cnzm/lrmDJXTJ4i1mxJk/awHD4Rj+7uqfO0/7CSgtQSG4juejiZRKOdrA45FIt1tB9eRxprr6wvLNcnNJjBHLwvI5oJveJulphAJv3nR+EO89ALvrnJzOR1ww8Zv2t46RhVIEiIhfIQ==';
    expect(signed.value).toContain(
      `<SignatureValue>${expectedSignatureValue}</SignatureValue>`,
    );

    const expectedSignatureMetadata = `<Signature xmlns="http://www.w3.org/2000/09/xmldsig#"><SignedInfo><CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/><SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/><Reference URI="#NFe42250903916076000583550560000005651509037627"><Transforms><Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/><Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/></Transforms><DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>`;
    expect(signed.value).toContain(expectedSignatureMetadata);

    const expectedInfNFeGroup = xml
      .replace(/(>)\s*(<)/gm, '$1$2')
      .replace('</NFe>', '')
      .replace(
        `<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">`,
        '',
      );

    expect(signed.value).toContain(expectedInfNFeGroup);
  });
});
