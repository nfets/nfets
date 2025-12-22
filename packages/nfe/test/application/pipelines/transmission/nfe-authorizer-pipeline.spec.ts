import { Environment, StateCodes, type StateCode } from '@nfets/core/domain';
import { expectIsRight } from '@nfets/test/expects';
import { NfeAuthorizerPipeline } from '@nfets/nfe/application/pipelines/transmission/nfe-authorizer-pipeline';
import { TpEmis } from '@nfets/nfe/domain/entities/constants/tp-emis';
import { right } from '@nfets/core/shared';
import contingency from '@nfets/nfe/services/contingency-webservices-mod55';

import type { ReadCertificateRequest } from '@nfets/core/domain';
import type { RemoteTransmissionRepository } from '@nfets/core/domain';
import type { NfeRemoteClient } from '@nfets/nfe/domain/entities/transmission/nfe-remote-client';
import type { NFe } from '@nfets/nfe/infrastructure/dto/nfe/nfe';
import { type SynchronousAutorizacaoResponse } from '@nfets/nfe/domain/entities/services/autorizacao';
import {
  getCertificatePassword,
  getCnpjCertificate,
} from '@nfets/test/certificates';
import { NfeRemoteTransmitter } from '@nfets/nfe/application/transmission/nfe-transmitter';
import { MemoryCacheAdapter, NativeCertificateRepository } from '@nfets/core';
import axios from 'axios';
import { CryptoSignerRepository } from '@nfets/core/infrastructure/repositories/crypto-signer-repository';
import { NfeXmlBuilderPipeline } from '@nfets/nfe/application';

const NORMAL_WEBSERVICE_URLS: Record<StateCode, string> = {
  [StateCodes.AC]:
    'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
  [StateCodes.AL]:
    'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
  [StateCodes.AM]:
    'https://homnfe.sefaz.am.gov.br/services2/services/NfeAutorizacao4',
  [StateCodes.AP]:
    'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
  [StateCodes.BA]:
    'https://hnfe.sefaz.ba.gov.br/webservices/NFeAutorizacao4/NFeAutorizacao4.asmx',
  [StateCodes.CE]:
    'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
  [StateCodes.DF]:
    'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
  [StateCodes.ES]:
    'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
  [StateCodes.GO]:
    'https://homolog.sefaz.go.gov.br/nfe/services/NFeAutorizacao4',
  [StateCodes.MA]:
    'https://hom.sefazvirtual.fazenda.gov.br/NFeAutorizacao4/NFeAutorizacao4.asmx',
  [StateCodes.MG]:
    'https://hnfe.fazenda.mg.gov.br/nfe2/services/NFeAutorizacao4',
  [StateCodes.MS]: 'https://hom.nfe.sefaz.ms.gov.br/ws/NFeAutorizacao4',
  [StateCodes.MT]:
    'https://homologacao.sefaz.mt.gov.br/nfews/v2/services/NfeAutorizacao4',
  [StateCodes.PA]:
    'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
  [StateCodes.PB]:
    'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
  [StateCodes.PE]:
    'https://nfehomolog.sefaz.pe.gov.br/nfe-service/services/NFeAutorizacao4',
  [StateCodes.PI]:
    'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
  [StateCodes.PR]: 'https://homologacao.nfe.sefa.pr.gov.br/nfe/NFeAutorizacao4',
  [StateCodes.RJ]:
    'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
  [StateCodes.RN]:
    'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
  [StateCodes.RO]:
    'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
  [StateCodes.RR]:
    'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
  [StateCodes.RS]:
    'https://nfe-homologacao.sefazrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
  [StateCodes.SC]:
    'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
  [StateCodes.SE]:
    'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
  [StateCodes.SP]:
    'https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx',
  [StateCodes.TO]:
    'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
} as const;

const CONTINGENCY_URLS = {
  SVCAN:
    'https://hom.sefazvirtual.fazenda.gov.br/NFeAutorizacao4/NFeAutorizacao4.asmx',
  SVCRS:
    'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx',
} as const;

const getNormalWebserviceUrl = (cUF: StateCode): string => {
  return NORMAL_WEBSERVICE_URLS[cUF];
};

const getContingencyWebserviceUrl = (cUF: StateCode): string => {
  const contingencyType = contingency[cUF];
  return CONTINGENCY_URLS[contingencyType];
};

const entity = (
  cUF: StateCode,
  tpEmis: TpEmis,
  options?: { xJust?: string; dhCont?: string },
): NFe => {
  return {
    $: { xmlns: 'http://www.portalfiscal.inf.br/nfe' },
    infNFe: {
      $: { versao: '4.00' },
      ide: {
        cUF,
        cNF: '12345678',
        natOp: 'Venda',
        mod: '55',
        serie: '1',
        nNF: '1',
        dhEmi: '2024-01-01T10:00:00-03:00',
        tpNF: '1',
        idDest: '2',
        cMunFG: '3550308',
        tpImp: '1',
        tpEmis,
        cDV: '1',
        tpAmb: Environment.Homolog,
        finNFe: '1',
        indFinal: '0',
        indPres: '1',
        procEmi: '0',
        verProc: 'test',
        ...(options?.xJust && { xJust: options.xJust }),
        ...(options?.dhCont && { dhCont: options.dhCont }),
      },
      emit: {
        CNPJ: '12345678000190',
        xNome: 'Teste',
        enderEmit: {
          xLgr: 'Rua Teste',
          nro: '123',
          xBairro: 'Centro',
          cMun: '3550308',
          xMun: 'Sao Paulo',
          UF: 'SP',
          CEP: '01000000',
          cPais: '1058',
          xPais: 'Brasil',
        },
        IE: '123456789012',
        CRT: '1',
      },
      det: [
        {
          $: { nItem: '1' },
          prod: {
            cProd: '1',
            cEAN: 'SEM GTIN',
            xProd: 'Produto',
            NCM: '00000000',
            CFOP: '5102',
            uCom: 'UN',
            qCom: '1',
            vUnCom: '0',
            vProd: '0',
            cEANTrib: 'SEM GTIN',
            uTrib: 'UN',
            qTrib: '1',
            vUnTrib: '0',
            indTot: '1',
          },
          imposto: {
            vTotTrib: 0,
            ICMS: {
              ICMS00: {
                orig: '0',
                CST: '00',
                modBC: '0',
                vBC: '0',
                pICMS: '0',
                vICMS: '0',
              },
            },
          },
        },
      ],
      total: {
        ICMSTot: {
          vBC: '0',
          vICMS: '0',
          vICMSDeson: '0',
          vFCP: '0',
          vBCST: '0',
          vST: '0',
          vFCPST: '0',
          vFCPSTRet: '0',
          vProd: '0',
          vFrete: '0',
          vSeg: '0',
          vDesc: '0',
          vII: '0',
          vIPI: '0',
          vIPIDevol: '0',
          vPIS: '0',
          vCOFINS: '0',
          vOutro: '0',
          vNF: '0',
          vTotTrib: '0',
        },
      },
      transp: { modFrete: '9' },
      pag: { detPag: [{ tPag: '01', vPag: '0' }] },
    },
  };
};

describe('nfe authorizer pipeline (contingency) (unit)', () => {
  const password = getCertificatePassword(),
    pfxPathOrBase64 = getCnpjCertificate();

  let pipeline: NfeAuthorizerPipeline;
  let spy: jest.SpyInstance;

  beforeAll(async () => {
    const certificates = new NativeCertificateRepository(
      axios.create(),
      new CryptoSignerRepository(),
      new MemoryCacheAdapter(),
    );

    const certificate = await certificates.read({ pfxPathOrBase64, password });
    certificates.read = jest.fn().mockResolvedValue(certificate);

    class MockableNfeAuthorizerPipeline extends NfeAuthorizerPipeline {
      protected override readonly soap: RemoteTransmissionRepository<NfeRemoteClient> =
        {
          setCertificate: jest.fn(),
          send: jest.fn().mockImplementation(() => {
            return Promise.resolve(
              right({
                retEnviNFe: {
                  $: { versao: '4.00' },
                  tpAmb: Environment.Homolog,
                  cUF: '35',
                  verAplic: '1.0',
                  cStat: '103',
                  xMotivo: 'Lote recebido com sucesso',
                  dhRecbto: new Date().toISOString(),
                  protNFe: {
                    $: { versao: '4.00' },
                    infProt: {
                      tpAmb: Environment.Homolog,
                      verAplic: '1.0',
                      cStat: '103',
                      chNFe: '123456789012345',
                      digVal: '123456789012345',
                      xMotivo: 'Lote recebido com sucesso',
                      cUF: '35',
                      dhRecbto: new Date().toISOString(),
                      nProt: '123456789012345',
                    },
                  },
                },
              } as SynchronousAutorizacaoResponse),
            );
          }),
        } as unknown as RemoteTransmissionRepository<NfeRemoteClient>;

      protected override transmitter = new NfeRemoteTransmitter(this.soap);
      protected override readonly certificates = certificates;

      constructor(certificate: ReadCertificateRequest) {
        super(certificate);
        spy = jest.spyOn(this.soap, 'send');
      }
    }

    pipeline = new MockableNfeAuthorizerPipeline({
      pfxPathOrBase64,
      password,
    });
  });

  const states = Object.entries(StateCodes) as [
    keyof typeof StateCodes,
    StateCode,
  ][];

  states.forEach(([acronym, cUF]) => {
    it(`should use normal webservice for ${acronym} (${cUF})`, async () => {
      const NFe = entity(cUF, TpEmis.Normal);

      const url = getNormalWebserviceUrl(cUF);
      const result = await pipeline.execute({ NFe, idLote: '1' });

      expectIsRight(result);
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ url }));
    });

    it(`should use contingency webservice (${
      contingency[cUF as keyof typeof contingency]
    }) for ${acronym} (${cUF})`, async () => {
      const NFe = entity(cUF, TpEmis.SVCAN, {
        xJust: 'Contingência',
        dhCont: new Date().toISOString(),
      });

      const url = getContingencyWebserviceUrl(cUF);
      const result = await pipeline.execute({ NFe, idLote: '1' });

      expectIsRight(result);
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ url }));
    });
  });
});

describe('nfe authorizer pipeline (unit)', () => {
  const password = getCertificatePassword(),
    pfxPathOrBase64 = getCnpjCertificate();

  let pipeline: NfeAuthorizerPipeline;

  beforeAll(async () => {
    const certificates = new NativeCertificateRepository(
      axios.create(),
      new CryptoSignerRepository(),
      new MemoryCacheAdapter(),
    );

    const certificate = await certificates.read({ pfxPathOrBase64, password });
    certificates.read = jest.fn().mockResolvedValue(certificate);

    class MockableNfeAuthorizerPipeline extends NfeAuthorizerPipeline {
      protected override readonly soap: RemoteTransmissionRepository<NfeRemoteClient> =
        {
          setCertificate: jest.fn(),
          send: jest.fn().mockImplementation(() => {
            return Promise.resolve(
              right({
                retEnviNFe: {
                  $: { versao: '4.00' },
                  tpAmb: Environment.Homolog,
                  cUF: '35',
                  verAplic: '1.0',
                  cStat: '103',
                  xMotivo: 'Lote recebido com sucesso',
                  dhRecbto: new Date().toISOString(),
                  protNFe: {
                    $: { versao: '4.00' },
                    infProt: {
                      tpAmb: Environment.Homolog,
                      verAplic: '1.0',
                      chNFe: '123456789012345',
                      dhRecbto: new Date(
                        '2025-12-22T18:40:33.060Z',
                      ).toISOString(),
                      nProt: '123456789012345',
                      digVal: '123456789012345',
                      cStat: '100',
                      xMotivo: 'Autorizado o uso da NF-e',
                    },
                  },
                },
              } as SynchronousAutorizacaoResponse),
            );
          }),
        } as unknown as RemoteTransmissionRepository<NfeRemoteClient>;

      protected override transmitter = new NfeRemoteTransmitter(this.soap);
      protected override readonly certificates = certificates;
    }

    pipeline = new MockableNfeAuthorizerPipeline({
      pfxPathOrBase64,
      password,
    });
  });

  it('should authorize a single nfe and return the correct response with protocol', async () => {
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

    const xmlBuilderPipeline = new NfeXmlBuilderPipeline<NFe>({
      pfxPathOrBase64,
      password,
    });

    const builder = xmlBuilderPipeline.build((builder) =>
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

    const xmlOrLeft = await builder.assemble();

    expectIsRight(xmlOrLeft);
    expect(xmlOrLeft.value).toBeDefined();

    const NFe = `<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
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
</NFe>`;

    expect(xmlOrLeft.value).toBeDefined();
    expect(xmlOrLeft.value).toStrictEqual(
      `<?xml version="1.0" encoding="UTF-8"?>
${NFe}`
        .replace(/\s+/g, ' ')
        .replace(/(>)\s+(<)/g, '$1$2')
        .trim(),
    );

    const NFeOrLeft = builder.toObject();
    expectIsRight(NFeOrLeft);

    const result = await pipeline.execute({
      NFe: NFeOrLeft.value,
      idLote: '1',
    });

    expectIsRight(result);
    const { response, xml } = result.value;

    expect(response).toBeDefined();
    expect(response.retEnviNFe.protNFe).toStrictEqual({
      $: { versao: '4.00' },
      infProt: {
        tpAmb: '2',
        verAplic: '1.0',
        chNFe: '123456789012345',
        dhRecbto: '2025-12-22T18:40:33.060Z',
        nProt: '123456789012345',
        digVal: '123456789012345',
        cStat: '100',
        xMotivo: 'Autorizado o uso da NF-e',
      },
    });

    expect(xml).toBeDefined();
    expect(xml).toStrictEqual(
      `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
${NFe}
<protNFe versao="4.00">
  <infProt>
    <tpAmb>2</tpAmb>
    <verAplic>1.0</verAplic>
    <chNFe>123456789012345</chNFe>
    <dhRecbto>2025-12-22T18:40:33.060Z</dhRecbto>
    <nProt>123456789012345</nProt>
    <digVal>123456789012345</digVal>
    <cStat>100</cStat>
    <xMotivo>Autorizado o uso da NF-e</xMotivo>
    </infProt>
  </protNFe>
</nfeProc>`
        .replace(/\s+/g, ' ')
        .replace(/(>)\s+(<)/g, '$1$2')
        .trim(),
    );
  });
});
