import { NfeXmlBuilderPipeline } from '@nfets/nfe/application/pipelines/xml/nfe-xml-builder-pipeline';
import { TpEmis, type NFe } from '@nfets/nfe/domain';
import {
  getCertificatePassword,
  getCnpjCertificate,
} from '@nfets/test/certificates';
import { expectIsRight } from '@nfets/test/expects';

describe('NfeXmlBuilderPipeline', () => {
  const password = getCertificatePassword(),
    validCnpjPfxCertificate = getCnpjCertificate();

  it('should build a valid nfe (55) xml', async () => {
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

    const pipeline = new NfeXmlBuilderPipeline<NFe>({
      pfxPathOrBase64: validCnpjPfxCertificate,
      password,
    });

    const builder = pipeline.build((builder) =>
      builder
        .infNFe({ versao: '4.00' })
        .ide({
          cUF: '52',
          cNF: '78527251',
          natOp: 'Venda de mercadoria',
          mod: '55',
          serie: '99',
          nNF: '8018',
          dhEmi: '2024-06-12T06:55:26-03:00',
          dhSaiEnt: '2024-06-12T06:57:56-03:00',
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
                vICMS: 18,
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
          fat: { nFat: 'NF-8018', vOrig: 100 },
          dup: [
            {
              nDup: '1',
              dVenc: '2025-04-15',
              vDup: 100,
            },
          ],
        })
        .pag({
          detPag: [{ tPag: '01', vPag: 100 }],
        }),
    );

    const result = await builder.assemble();

    expectIsRight(result);
    expect(result.value).toBeDefined();

    expect(result.value).toBeDefined();
    expect(result.value).toStrictEqual(
      `<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe52240646755763000143550990000080181785272515" versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T06:55:26-03:00</dhEmi>
      <dhSaiEnt>2024-06-12T06:57:56-03:00</dhSaiEnt>
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
  <Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
    <SignedInfo>
        <CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
        <SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>
        <Reference URI="#NFe52240646755763000143550990000080181785272515">
            <Transforms>
                <Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
                <Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
            </Transforms>
            <DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>
            <DigestValue>JkoZVS8ZpUeuG0OQq2Z3NkBNpjI=</DigestValue>
        </Reference>
    </SignedInfo>
    <SignatureValue>X0IoKvJU1F3e7m1td4vk5BCavYIvYiG7b1X7GJk6N/xiZ+t1bvwmXa/Nu2hchJx4DkFRk1ih6lLfWhvF0vU3NU7z9I1xg7HCYTnPhGGkrzW5v+0jhIoSsZsMYjrCKAj98f2gphxfn4S+K96a1kU+hyRzPfAbjvHMWuVqpNzrGC785WTDPwRM39k2YGiGbkV+aT/sPkbNSvqbqCOXXE5ZDdoE707CeqP7BQlx1UNMUCx1xeHcUAG6XzG6I9y2pOJNZbUDjI5SXO7Ql0ZjqLGcxJ5v9Ysn5YrYeP6TgmKSOaQ2nb7yPzEbb70zZNb2GTS0IuTf+YbWlQK9a8IlQd5vxQ==</SignatureValue>
    <KeyInfo>
      <X509Data>
        <X509Certificate>MIIEWzCCA0OgAwIBAgIUQcz+nB7qwbAmZM93quQvbmShF7QwDQYJKoZIhvcNAQELBQAwgasxCzAJBgNVBAYTAkJSMRUwEwYDVQQIDAxTw4PCo28gUGF1bG8xFTATBgNVBAcMDFPDg8KjbyBQYXVsbzETMBEGA1UECgwKSUNQLUJyYXNpbDEaMBgGA1UECwwRQ2VydGlmaWNhZG8gUEogQTExGzAZBgNVBAMMEjc5LjgzOS42MDEvMDAwMS00MjEgMB4GCSqGSIb3DQEJARYRZW1haWxAZXhhbXBsZS5jb20wHhcNMjUxMTA2MTYwMjI2WhcNMzUxMTA0MTYwMjI2WjCBqzELMAkGA1UEBhMCQlIxFTATBgNVBAgMDFPDg8KjbyBQYXVsbzEVMBMGA1UEBwwMU8ODwqNvIFBhdWxvMRMwEQYDVQQKDApJQ1AtQnJhc2lsMRowGAYDVQQLDBFDZXJ0aWZpY2FkbyBQSiBBMTEbMBkGA1UEAwwSNzkuODM5LjYwMS8wMDAxLTQyMSAwHgYJKoZIhvcNAQkBFhFlbWFpbEBleGFtcGxlLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALojUCwbca24daDhYinBZHnQs0+0g8atK9qrUsBLOlOiMCaGVt37tb+O+sDEnUHuu5gZvsBuRIT6vcWxmL5BBYyolpYI2eLMKtIK8NYn60dVrz9zIxQHyruLw7AfZifTqC0hPN/FWG4quGQ+Vovs7Rx1Wb6Id173O+kBRs1zgMYwzVVEzqtQDYvOBL/0WBSRY0SsI2mjE2d4UUCS7Gsex7BO28qIMlyl88+SQBZPPuwbUjrn1YmQ5q+cRMp2H0GMEQbuC//Rfy61VedZ9BCYF8YeGicPKz7BuzYAd8PYYakKf1JWDdUTtoRlDzcLwceLZ04Mev7Yo4BcCv6vr3OSE8kCAwEAAaN1MHMwNwYDVR0RBDAwLoERZW1haWxAZXhhbXBsZS5jb22gGQYFYEwBAwOgEAwONzk4Mzk2MDEwMDAxNDIwDAYDVR0TBAUwAwEB/zALBgNVHQ8EBAMCAQYwHQYDVR0OBBYEFPE9sBZtgVklMWSgrJ0Tq4XgYG4iMA0GCSqGSIb3DQEBCwUAA4IBAQBjXyt+CvTbBAOjUx2r/dG0cJ9JeclIzvn+T6EUs8klVSekrbfAyrrcxFV8UO8zL5WDnHVp5gUXpL2VRa1KFmHCPzSEZnZyQgVXc92YfMrg/SCUAodgxgrushpXeJ72gu/JYTh8xZWLNpGRvQdfeDOeYlhaulM5rv5IkNm4TlpxXUrNYzMU6kNR0At8Xm6MDTS9axWRmV76h51foZbYjgq4EuhaRWU1V6JB6EKOE+bya6exBXasjp+CRVCiEVZwpP5lwTXNJkuO+n/cBDo3Hm9zcw9qxp3qEaZluGe5v54Pp/F97lNMV4JPNvAZ74OfWdO0Nk3t2SXoy/VQCnUOCfTj</X509Certificate>
      </X509Data>
    </KeyInfo>
  </Signature>
</NFe>`
        .replace(/\s+/g, ' ')
        .replace(/(>)\s+(<)/g, '$1$2')
        .trim(),
    );
  });
});
