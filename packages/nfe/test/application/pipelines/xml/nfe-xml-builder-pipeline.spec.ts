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
    <SignatureValue>ljrKTfr6DrqnDBqpPzjB28qkszErO0RG2R1KYs0aE89r7tl9LIj1P/Eok1I4Rg3nK7Lkdvwqn+pvgMOZCIe/Mh0ygyPSWS8pm6NkeQ1E09CtiJS6WPStCq+gACp4wyNcO0OpUFVxnalr3rM+QS32Zk1mQ1tXL0xNBLfmmYkgxaTXsH4FGD0KbBBgdDUwIWjSeQRIa0KN7qlZBzLheIKwCT2h0ua1eAx32KB/mIT4CAkB3LhQVhLc6frqCzYb5IgYbnvuQaMqZUKd9b0EaqqvWQlbtJh6ZSX5bfgtj4Cpmwm+za8H+sCf8BIswy3x12+FJ7ufMQbHInHczKymBRrlbA==</SignatureValue>
    <KeyInfo>
      <X509Data>
        <X509Certificate>MIIEaTCCA1GgAwIBAgIUU5NidIJ8A/5mGmUXr2Z2CmOmkQwwDQYJKoZIhvcNAQELBQAwgbIxCzAJBgNVBAYTAkJSMQswCQYDVQQIDAJTUDEVMBMGA1UEBwwMU8ODwqNvIFBhdWxvMRMwEQYDVQQKDApJQ1AtQnJhc2lsMSgwJgYDVQQDDB9FTVBSRVNBIERFIFRFU1RFOjc5ODM5NjAxMDAwMTQyMR4wHAYDVQQLDBVBQyBTT0xVVEkgTXVsdGlwbGEgdjUxIDAeBgkqhkiG9w0BCQEWEWVtYWlsQGV4YW1wbGUuY29tMB4XDTI1MTIyMDAxMTEyN1oXDTM1MTIxODAxMTEyN1owgbIxCzAJBgNVBAYTAkJSMQswCQYDVQQIDAJTUDEVMBMGA1UEBwwMU8ODwqNvIFBhdWxvMRMwEQYDVQQKDApJQ1AtQnJhc2lsMSgwJgYDVQQDDB9FTVBSRVNBIERFIFRFU1RFOjc5ODM5NjAxMDAwMTQyMR4wHAYDVQQLDBVBQyBTT0xVVEkgTXVsdGlwbGEgdjUxIDAeBgkqhkiG9w0BCQEWEWVtYWlsQGV4YW1wbGUuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyeOdp7F2KUArVwIGu47LY27YgzLw6R9qbgDCCl6dCrYnvaAaDEYEuEDGkH2ViAxKRfmb/bHdkWLQWZwnNg9inlPbTSa1cvmcAE7GRD/+B3YBRwc1sc/i6zgm1nIttILbJB7Cb6PkSud5MeV5voq/Bj7qCS/FVoFtz1vHaaTMfM/5DZz+dUrZs8WahwDjIegL8mWHH5YKEFnc/4e4H0n/tui9duQgehmRWDDxljCOV6xKK2sx+YuG/GW0jJdi5asbjR6I+U8g/C+0VobhYb1rA0aIkfh/qfDWHzeN0EMkcw6O2Cet4Z7PO6zgr0fItUlkYb2FUYfJPmkJJ/fLRX4hTQIDAQABo3UwczA3BgNVHREEMDAugRFlbWFpbEBleGFtcGxlLmNvbaAZBgVgTAEDA6AQDA43OTgzOTYwMTAwMDE0MjAMBgNVHRMEBTADAQH/MAsGA1UdDwQEAwIBBjAdBgNVHQ4EFgQUoAcoXz39JnM6MusQwIktx7SxQwEwDQYJKoZIhvcNAQELBQADggEBACnLoiW5Zz/WtCkUX5p5BTbL1oTycQKeAERaEsmP/n53e81QYEnMtOEfB7z6IXaOx9KDE95qPPPJXVqantKPHDuD6uHjvSEI/RLb8i1v9KC9YCjtP7cDbl6iuTUBpHtXJq3pi/Ef5LQujo5gMphaQq6KhO2jL4zYJHHY6ogrgzzW1Zn7RI5+4m3WOHUDzjrDqsyGhqOQv2fVfjKYzaBk0cT8I24YHRdTyakfc8NxkMF0xLj95EoXhwSNBMOklgjJ+frZnK5RhQKxoFZVG93gfZuospyq3CN3Yq/pC+Vtnqayq6wsx5onAPr8nWES1HIknSkMP24IY7NPXZ1QKvPmVhM=</X509Certificate>
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
