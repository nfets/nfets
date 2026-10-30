import type { HttpClient } from '@nfets/core/domain';
import axios from 'axios';

import { EntitySigner, NFeTsError, Xml2JsToolkit } from '@nfets/core';
import { ensureIntegrationTestsHasValidCertificate } from '@nfets/test/ensure-integration-tests';
import { SignatureAlgorithm } from '@nfets/core/domain/entities/signer/algo';
import { NativeCertificateRepository } from '@nfets/core/infrastructure/repositories/native-certificate-repository';
import { MemoryCacheAdapter } from '@nfets/core/infrastructure/repositories/memory-cache-adapter';
import type { ReadCertificateResponse } from '@nfets/core/domain/entities/certificate/certificate';
import { getCnpjCertificateReadRequest } from '@nfets/test/certificates';
import type { CertificateRepository } from '@nfets/core/domain/repositories/certificate-repository';
import type { XmlToolkit } from '@nfets/core/domain/entities/xml/xml-toolkit';

import { expectIsLeft, expectIsRight } from '@nfets/test/expects';
import { ensurePlatform } from '@nfets/test/ensure-platform';

describe('entity signer (integration)', () => {
  if (!ensurePlatform('linux')) return;

  let certificate: ReadCertificateResponse | undefined;
  const toolkit: XmlToolkit = new Xml2JsToolkit();
  let certificateRepository: CertificateRepository;

  const cert = ensureIntegrationTestsHasValidCertificate();
  if (cert === undefined) return;

  beforeAll(async () => {
    certificateRepository = new NativeCertificateRepository(
      axios.create() as HttpClient,
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
    const signer = new EntitySigner(
      toolkit,
      certificateRepository,
      SignatureAlgorithm.SHA1,
    );

    const signature = await signer.sign(
      { $: { xmlns: 'http://www.portalfiscal.inf.br/nfe' }, test: {} },
      { tag: 'someTagThatDoesNotExist' as never, mark: 'root' },
      certificate,
    );

    expectIsLeft(signature);
    expect(signature.value).toStrictEqual(
      new NFeTsError('Node someTagThatDoesNotExist not found'),
    );
  });
});

describe('entity signer (unit)', () => {
  if (process.platform === 'win32') {
    return (it.skip('test only for non-win32 platform', () => void 0), void 0);
  }

  const certificateRequest = getCnpjCertificateReadRequest();

  const toolkit: XmlToolkit = new Xml2JsToolkit();
  let certificate: ReadCertificateResponse | undefined;
  let certificateRepository: CertificateRepository;

  beforeAll(async () => {
    certificateRepository = new NativeCertificateRepository(
      axios.create() as HttpClient,
      new MemoryCacheAdapter(),
    );

    const certificateOrError =
      await certificateRepository.read(certificateRequest);

    if (certificateOrError.isLeft()) return;
    certificate = certificateOrError.value;
  });

  it('should generate a valid SHA1 signature', async () => {
    if (certificate === undefined) return;

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <NFe xmlns="http://www.portalfiscal.inf.br/nfe">
      <infNFe Id="NFe422509N4BW1CV0000100550560000005651509037627" versao="4.00">
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
          <CNPJ>N4BW1CV0000100</CNPJ>
          <xNome>email@example.com</xNome>
          <xFant>email@example.comu</xFant>
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
          <CNPJ>N4BW1CV0000100</CNPJ>
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
          <CNPJ>N4BW1CV0000100</CNPJ>
          <xContato>Fulano da Silva</xContato>
          <email>email@example.com</email>
          <fone>4999999999</fone>
        </infRespTec>
      </infNFe>
    </NFe>`;

    const entity = await toolkit.parse<{
      $: { xmlns: string };
      infNFe: unknown;
    }>(xml);

    const signer = new EntitySigner(
      toolkit,
      certificateRepository,
      SignatureAlgorithm.SHA1,
    );

    const signed = await signer.sign(
      entity,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expect(signed.value).toBeDefined();

    const expectedDigestValue = 'PjaDjMPy+9i6jBNBmNaAYcypboE=';
    expect(
      signed.value.Signature.SignedInfo.Reference.DigestValue,
    ).toStrictEqual(expectedDigestValue);

    const expectedSignatureValue =
      'uV7oqPWamfEwNEHdBc0U8A69Jx09XAgRLFVrWVADTYYlWWjUF72lUczilyCUt473Lr0tuZQw3y/r3oSXNtigKLZrrTjgPfFH24bqcWGni1xqWLtylmFu1o+Cp6qlhT+O7grAG7o0XxWIS3l7KLvyPubt9JT8CGopbZsYiKhu2iCax5kGZW8MqruSZPUsjtheAUm08n1Vd/XwrCCSuxf3QkqPg06GDHIcAnrOoJwYrthtPrk6Jx1DU+RkGjztBzVpY1z+dne44BawA28s6TNlNaiXxAQrfPm7o7VAkJpG54g668O9ZpexsV6oFKaHn1gEdlYUA2Od6tDc/QrW7A8LFw==';
    expect(signed.value.Signature.SignatureValue).toStrictEqual(
      expectedSignatureValue,
    );

    expect(
      signed.value.Signature.SignedInfo.CanonicalizationMethod.$,
    ).toStrictEqual({
      Algorithm: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
    });

    expect(signed.value.Signature.SignedInfo.SignatureMethod.$).toStrictEqual({
      Algorithm: 'http://www.w3.org/2000/09/xmldsig#rsa-sha1',
    });
    expect(signed.value.Signature.SignedInfo.Reference.$).toStrictEqual({
      URI: '#NFe422509N4BW1CV0000100550560000005651509037627',
    });
    expect(
      signed.value.Signature.SignedInfo.Reference.Transforms.Transform[0].$,
    ).toStrictEqual({
      Algorithm: 'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
    });
    expect(
      signed.value.Signature.SignedInfo.Reference.Transforms.Transform[1].$,
    ).toStrictEqual({
      Algorithm: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
    });
    expect(
      signed.value.Signature.SignedInfo.Reference.DigestMethod.$,
    ).toStrictEqual({ Algorithm: 'http://www.w3.org/2000/09/xmldsig#sha1' });
  });

  it('should generate a valid SHA256 signature', async () => {
    if (certificate === undefined) return;

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe422509N4BW1CV0000100550560000005651509037627" versao="4.00">
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
      <CNPJ>N4BW1CV0000100</CNPJ>
      <xNome>email@example.com</xNome>
      <xFant>email@example.comu</xFant>
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
      <CNPJ>N4BW1CV0000100</CNPJ>
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
      <CNPJ>N4BW1CV0000100</CNPJ>
      <xContato>Fulano da Silva</xContato>
      <email>email@example.com</email>
      <fone>4999999999</fone>
    </infRespTec>
  </infNFe>
</NFe>`;

    const entity = await toolkit.parse<{
      $: { xmlns: string };
      infNFe: unknown;
    }>(xml);

    const signer = new EntitySigner(
      toolkit,
      certificateRepository,
      SignatureAlgorithm.SHA256,
    );

    const signed = await signer.sign(
      entity,
      { tag: 'infNFe', mark: 'Id' },
      certificate,
    );
    expectIsRight(signed);
    expect(signed.value).toBeDefined();

    const expectedDigestValue = '9tFioAigC7S5Ko/lF/IEoXvdf2E5WdcMHjKkh72dBMQ=';
    expect(
      signed.value.Signature.SignedInfo.Reference.DigestValue,
    ).toStrictEqual(expectedDigestValue);

    const expectedSignatureValue =
      'VUKFfnzIPqBdevcG010nzCsKt7eXv6eSt/WzEqv5TNmRFMjnEv+Se7lo9Bvk4PyDbQM18DJxb+c6JrQtS87Ojh8lfFp5CY+rSj/kbaipCn1NwDbItveKdfTjoKAKDP0CKfhy/b7n/M7jLvPllB8KiB8Yc6dx3sPxjEsopVnOQHi8MhDr0F7HEdoemqlWHaFVwrdsYxIJBzgalUUZJsiwNuT3aUEoRJB4osixUeBYFYsDd29e1SB2yvzNLzkQeS4EzjzoY4HWCie6YXWybcFyOATV9bagTeXsiOf0jmYq+UUfZKX59LEvhk2H7y+TZIh5hnoPUV0IgT/H9h9utYsToA==';
    expect(signed.value.Signature.SignatureValue).toStrictEqual(
      expectedSignatureValue,
    );

    expect(
      signed.value.Signature.SignedInfo.CanonicalizationMethod.$,
    ).toStrictEqual({
      Algorithm: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
    });

    expect(signed.value.Signature.SignedInfo.SignatureMethod.$).toStrictEqual({
      Algorithm: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
    });
    expect(signed.value.Signature.SignedInfo.Reference.$).toStrictEqual({
      URI: '#NFe422509N4BW1CV0000100550560000005651509037627',
    });
    expect(
      signed.value.Signature.SignedInfo.Reference.Transforms.Transform[0].$,
    ).toStrictEqual({
      Algorithm: 'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
    });
    expect(
      signed.value.Signature.SignedInfo.Reference.Transforms.Transform[1].$,
    ).toStrictEqual({
      Algorithm: 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
    });
    expect(
      signed.value.Signature.SignedInfo.Reference.DigestMethod.$,
    ).toStrictEqual({ Algorithm: 'http://www.w3.org/2001/04/xmlenc#sha256' });
  });

  describe('unreachable algorithm cases', () => {
    it('should handle invalid algorithm by using unreachable', async () => {
      if (certificate === undefined) return;

      const signer = new EntitySigner(
        toolkit,
        certificateRepository,
        'INVALID' as never,
      );

      const entity = await toolkit.parse<{
        $: { xmlns: string };
        infNFe: unknown;
      }>(`<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="test" versao="4.00">
    <ide>
      <cUF>42</cUF>
    </ide>
  </infNFe>
</NFe>`);

      await expect(
        signer.sign(entity, { tag: 'infNFe', mark: 'Id' }, certificate),
      ).rejects.toThrow("Didn't expect to get here");
    });
  });
});
