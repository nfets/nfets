import {
  StateCodes,
  Environment,
  type CertificateRepository,
  type StateCode,
  type StateAcronym,
  type ReadCertificateResponse,
  NFeTsError,
} from '@nfets/core/domain';
import {
  Decimal,
  MemoryCacheAdapter,
  NativeCertificateRepository,
  SoapRemoteTransmissionRepository,
  Xml2JsToolkit,
} from '@nfets/core/infrastructure';
import { NfeXmlBuilder } from '@nfets/nfe';
import { NfeRemoteTransmitter } from '@nfets/nfe/application/transmission/nfe-transmitter';
import { type NfeRemoteClient } from '@nfets/nfe/domain/entities/transmission/nfe-remote-client';
import { ensureIntegrationTestsHasValidCertificate } from '@nfets/test/ensure-integration-tests';
import { expectIsLeft, expectIsRight } from '@nfets/test/expects';
import { ASN1, EntitySigner } from '@nfets/core/application';
import axios from 'axios';

import type { Emit } from '@nfets/nfe/domain/entities/nfe/inf-nfe/emit';
import type { Ide } from '@nfets/nfe/domain/entities/nfe/inf-nfe/ide';
import { TpEmis } from '@nfets/nfe/domain/entities/constants/tp-emis';

const SEFAZ_TIMEOUT_SC = 60 * 1000;

describe('soap nfe remote transmission (integration) (not destructive)', () => {
  const certificateFromEnvironment =
    ensureIntegrationTestsHasValidCertificate();
  if (certificateFromEnvironment === undefined) return;

  const toolkit = new Xml2JsToolkit();

  let transmission: NfeRemoteTransmitter;
  let repository: CertificateRepository;

  beforeAll(async () => {
    repository = new NativeCertificateRepository(
      axios.create(),
      new MemoryCacheAdapter(),
    );

    transmission = new NfeRemoteTransmitter(
      new SoapRemoteTransmissionRepository<NfeRemoteClient>(
        toolkit,
        repository,
      ),
    );

    const result = await repository.read({
      pfxPathOrBase64: certificateFromEnvironment.certificatePath,
      password: certificateFromEnvironment.password,
    });

    transmission.configure({
      cUF: StateCodes.SC,
      certificate: result.isRight() ? result.value : void 0,
      tpAmb: Environment.Homolog,
    });
  });

  it('should return left when cUF is invalid', async () => {
    const response = await transmission.consultStatus({
      cUF: '123' as StateCode,
      tpAmb: Environment.Homolog,
    });

    expectIsLeft(response);
    expect(response.value).toStrictEqual(
      new NFeTsError(
        'consultStatus.cUF must be one of the following values: 12, 27, 13, 16, 29, 23, 53, 32, 52, 21, 31, 50, 51, 15, 25, 26, 22, 41, 33, 24, 11, 14, 43, 42, 28, 35, 17',
      ),
    );
  });

  it('it should return "Servico em Operacao" when cStat is "107"', async () => {
    const response = await transmission.consultStatus({
      cUF: StateCodes.SC,
      tpAmb: Environment.Homolog,
    });

    expectIsRight(response);
    expect(response.value.retConsStatServ).toStrictEqual({
      $: { versao: '4.00' },
      tpAmb: '2',
      verAplic: 'RS202401251654',
      cStat: '107',
      xMotivo: 'Servico em Operacao',
      cUF: StateCodes.SC,
      dhRecbto: expect.any(String),
      tMed: '1',
    });
  });
});

describe('soap nfe remote transmission (integration) (destructive)', () => {
  if (process.env.DESTRUCTIVE_TESTS !== '1') {
    return it.only('destructive tests are disabled', () => void 0);
  }

  const certificateFromEnvironment =
    ensureIntegrationTestsHasValidCertificate();
  if (certificateFromEnvironment === undefined) return;

  const toolkit = new Xml2JsToolkit();

  let certificateResponse: ReadCertificateResponse;
  let transmission: NfeRemoteTransmitter;
  let repository: CertificateRepository;

  beforeAll(async () => {
    repository = new NativeCertificateRepository(
      axios.create(),
      new MemoryCacheAdapter(),
    );

    transmission = new NfeRemoteTransmitter(
      new SoapRemoteTransmissionRepository<NfeRemoteClient>(
        toolkit,
        repository,
      ),
    );

    const result = await repository.read({
      pfxPathOrBase64: certificateFromEnvironment.certificatePath,
      password: certificateFromEnvironment.password,
    });

    if (result.isRight()) {
      certificateResponse = result.value;
    }

    transmission.configure({
      cUF: StateCodes.SC,
      certificate: result.isRight() ? result.value : void 0,
      tpAmb: Environment.Homolog,
    });
  });

  it(
    'autorizacao',
    async () => {
      const items = [
        {
          description: 'Product 1',
          code: '1',
          price: 1,
          quantity: 1,
          unit: 'UN',
          total: 1,
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
        ...{
          description: string;
          code: string;
          price: number;
          quantity: number;
          unit: string;
          total: number;
        }[],
      ];

      const info = new ASN1().extractCertificateInfo(
        certificateResponse.certificate,
      );
      const args = JSON.parse(process.env.TEST_PAYLOAD ?? '{}') as Partial<
        Emit & Ide
      >;
      const ufAcronym = (args.enderEmit?.UF ?? info.ST ?? '') as StateAcronym;

      const builder = NfeXmlBuilder.create(toolkit)
        .infNFe({ versao: '4.00' })
        .ide({
          cUF: StateCodes[ufAcronym],
          cNF: new Date().getTime().toString().slice(0, 8),
          natOp: 'Venda de mercadoria',
          mod: args.mod ?? '55',
          serie: args.serie ?? '',
          nNF: args.nNF ?? '',
          dhEmi: '2025-11-07 10:29:03-03:00',
          tpNF: '1',
          idDest: '2',
          cMunFG: args.enderEmit?.cMun ?? '',
          tpImp: '1',
          tpEmis: TpEmis.Normal,
          tpAmb: Environment.Homolog,
          finNFe: '1',
          indFinal: '1',
          indPres: '1',
          procEmi: '0',
          verProc: 'nfets-0.0.1',
        })
        .emit({
          CRT: '1',
          xNome: args.xNome ?? info.CN ?? 'Emissor Teste LTDA',
          CNPJ: args.CNPJ ?? info.CNPJ ?? void 0,
          CPF: args.CPF ?? info.CPF ?? void 0,
          IE: args.IE ?? 'ISENTO',
          enderEmit: {
            xLgr: 'Rua exemplo',
            nro: 'S/N',
            CEP: args.enderEmit?.CEP ?? '',
            xMun: args.enderEmit?.xMun ?? info.L ?? '',
            UF: ufAcronym,
            cMun: args.enderEmit?.cMun ?? '',
            cPais: '1058',
            xBairro: 'Centro',
          },
        })
        .dest({
          CPF: '31702821072',
          xNome: 'João da Silva',
          indIEDest: '9',
          enderDest: {
            xLgr: 'Rua exemplo',
            nro: 'S/N',
            CEP: '04001000',
            xMun: 'São Paulo',
            cMun: '3550308',
            cPais: '1058',
            UF: 'SP',
            xBairro: 'Centro',
            xPais: 'Brasil',
          },
        })
        .det(items, (ctx, item) =>
          ctx
            .prod({
              cProd: item.code,
              cEAN: 'SEM GTIN',
              xProd: item.description,
              NCM: '00000000',
              CFOP: '6102',
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
              ICMSSN500: {
                orig: '0',
                CSOSN: '500',
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
        .pag({
          detPag: [{ tPag: '01', vPag: Decimal.from('1').toString() }],
        })
        .infRespTec({
          CNPJ: args.CNPJ ?? info.CNPJ ?? '',
          xContato: args.xNome ?? info.CN ?? 'Contact',
          email: 'email@example.com',
          fone: args.enderEmit?.fone ?? '49999999999',
        });

      const entityOrLeft = builder.toObject();
      expectIsRight(entityOrLeft);

      const signed = await new EntitySigner(toolkit, repository).sign(
        entityOrLeft.value,
        { tag: 'infNFe', mark: 'Id' },
        certificateResponse,
      );

      expectIsRight(signed);

      const response = await transmission.autorizacao({
        NFe: signed.value,
        indSinc: '1' as const,
        idLote: new Date().getTime().toString().slice(0, 15),
      });

      expectIsRight(response);
      console.log(
        'response:',
        JSON.stringify(response.value.retEnviNFe, null, 2),
      );

      const infProt = response.value.retEnviNFe.protNFe?.infProt;

      expect(infProt).toBeDefined();
      expect(infProt?.nProt).toBeDefined();
      expect(infProt?.cStat).toStrictEqual('100');
      expect(infProt?.xMotivo).toStrictEqual('Autorizado o uso da NF-e');
    },
    SEFAZ_TIMEOUT_SC,
  );
});
