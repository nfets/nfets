import {
  UF,
  Environment,
  type CertificateRepository,
  type StateAcronym,
  type ReadCertificateResponse,
} from '@nfets/core/domain';
import {
  Decimal,
  MemoryCacheAdapter,
  NativeCertificateRepository,
  SoapRemoteTransmissionRepository,
  Xml2JsToolkit,
} from '@nfets/core/infrastructure';
import { NfceXmlBuilder } from '@nfets/nfe/application/xml-builder/nfce-xml-builder';
import { NfceQrcode } from '@nfets/nfe/application/transmission/nfce-qrcode';
import { NfceRemoteTransmitter } from '@nfets/nfe/application/transmission/nfce-transmitter';
import { type NfceRemoteClient } from '@nfets/nfe/domain/entities/transmission/nfce-remote-client';
import { ensureIntegrationTestsHasValidCertificate } from '@nfets/test/ensure-integration-tests';
import { expectIsRight } from '@nfets/test/expects';
import { ASN1, EntitySigner } from '@nfets/core/application';
import axios from 'axios';

import type { Emit } from '@nfets/nfe/domain/entities/nfe/inf-nfe/emit';
import type { Ide } from '@nfets/nfe/domain/entities/nfe/inf-nfe/ide';

const SEFAZ_TIMEOUT_SC = 60 * 1000;

describe('soap nfce remote transmission (integration) (destructive)', () => {
  if (process.env.DESTRUCTIVE_TESTS !== '1') {
    return it.only('destructive tests are disabled', () => void 0);
  }

  const certificateFromEnvironment =
    ensureIntegrationTestsHasValidCertificate();
  if (certificateFromEnvironment === undefined) return;

  const toolkit = new Xml2JsToolkit();

  let qrCode: NfceQrcode;
  let certificateResponse: ReadCertificateResponse;
  let transmission: NfceRemoteTransmitter;
  let repository: CertificateRepository;

  beforeAll(async () => {
    repository = new NativeCertificateRepository(
      axios.create(),
      new MemoryCacheAdapter(),
    );

    qrCode = new NfceQrcode(repository);

    transmission = new NfceRemoteTransmitter(
      new SoapRemoteTransmissionRepository<NfceRemoteClient>(
        toolkit,
        repository,
      ),
      qrCode,
    );

    const result = await repository.read(
      certificateFromEnvironment.certificatePath,
      certificateFromEnvironment.password,
    );

    if (result.isRight()) {
      certificateResponse = result.value;
    }

    transmission.configure({
      cUF: UF.SC,
      certificate: result.isRight() ? result.value : void 0,
      tpAmb: Environment.Homolog,
      qrCode: {
        CSC: 'GPB0JBWLUR6HWFTVEAS6RJ69GPCROFPBBB8G',
        CSCId: '000001',
      },
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
      const args = JSON.parse(process.argv.at(-1) ?? '{}') as Partial<
        Emit & Ide
      >;
      const ufAcronym = (args.enderEmit?.UF ?? info.ST ?? '') as StateAcronym;

      const builder = NfceXmlBuilder.create(toolkit)
        .infNFe({ versao: '4.00' })
        .ide({
          cUF: UF[ufAcronym],
          cNF: new Date().getTime().toString().slice(0, 8),
          natOp: 'Venda de mercadoria',
          mod: args.mod ?? '65',
          serie: args.serie ?? '',
          nNF: args.nNF ?? '',
          dhEmi: '2025-11-11 10:41:03-03:00',
          tpNF: '1',
          idDest: '1',
          cMunFG: args.enderEmit?.cMun ?? '',
          tpImp: '4',
          tpEmis: '1',
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
            CEP: args.enderEmit?.CEP ?? '',
            xMun: args.enderEmit?.xMun ?? info.L ?? '',
            UF: ufAcronym,
            cMun: args.enderEmit?.cMun ?? '',
            cPais: '1058',
            xBairro: 'Centro',
          },
        })
        .det(items, (ctx, item) =>
          ctx
            .prod({
              cProd: item.code,
              cEAN: 'SEM GTIN',
              xProd: item.description,
              NCM: '00000000',
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
              ICMSSN102: {
                orig: '0',
                CSOSN: '102',
              },
            })
            // TODO: prevent this from being called
            // .ipi({
            //   cEnq: '999',
            //   IPINT: {
            //     CST: '53',
            //   },
            // })
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
