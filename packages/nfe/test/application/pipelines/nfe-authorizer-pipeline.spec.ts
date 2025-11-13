import { Environment, StateCodes, type StateCode } from '@nfets/core/domain';
import { expectIsRight } from '@nfets/test/expects';
import { NfeAuthorizerPipeline } from '@nfets/nfe/application/pipelines/nfe-authorizer-pipeline';
import { TpEmis } from '@nfets/nfe/domain/entities/constants/tp-emis';
import { right } from '@nfets/core/shared';
import contingency from '@nfets/nfe/services/contingency-webservices-mod55';

import type { ReadCertificateRequest } from '@nfets/core/domain';
import type { RemoteTransmissionRepository } from '@nfets/core/domain';
import type { NfeRemoteClient } from '@nfets/nfe/domain/entities/transmission/nfe-remote-client';
import type { NFe } from '@nfets/nfe/infrastructure/dto/nfe/nfe';
import type { EntitySigner } from '@nfets/core/application';
import {
  getCertificatePassword,
  getCnpjCertificate,
} from '@nfets/test/certificates';
import { NfeRemoteTransmitter } from '@nfets/nfe/application/transmission/nfe-transmitter';
import { MemoryCacheAdapter, NativeCertificateRepository } from '@nfets/core';
import axios from 'axios';

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

describe('nfe authorizer pipeline (unit)', () => {
  const password = getCertificatePassword(),
    pfxPathOrBase64 = getCnpjCertificate();

  let pipeline: NfeAuthorizerPipeline;
  let spy: jest.SpyInstance;

  beforeAll(async () => {
    const certificates = new NativeCertificateRepository(
      axios.create(),
      new MemoryCacheAdapter(),
    );

    const certificate = await certificates.read({ pfxPathOrBase64, password });
    certificates.read = jest.fn().mockResolvedValue(certificate);

    class MockableNfeAuthorizerPipeline extends NfeAuthorizerPipeline {
      protected override readonly soap: RemoteTransmissionRepository<NfeRemoteClient> =
        {
          setCertificate: jest.fn(),
          send: jest.fn().mockImplementation((_params) => {
            return Promise.resolve(
              right({
                retEnviNFe: {
                  tpAmb: Environment.Homolog,
                  cUF: '35',
                  verAplic: '1.0',
                  cStat: '103',
                  xMotivo: 'Lote recebido com sucesso',
                  cRec: '123456789012345',
                  dhRecbto: new Date().toISOString(),
                  tMed: '1',
                },
              }),
            );
          }),
        } as unknown as RemoteTransmissionRepository<NfeRemoteClient>;

      protected override transmitter = new NfeRemoteTransmitter(this.soap);
      protected override readonly certificates = certificates;

      constructor(certificate: ReadCertificateRequest) {
        super(certificate);
        spy = jest.spyOn(this.soap, 'send');
      }

      protected override readonly signer = {
        sign: jest.fn().mockResolvedValue(right('<xml>signed</xml>')),
      } as unknown as EntitySigner;
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
