import { StateCodes, Environment, type StateAcronym } from '@nfets/core/domain';
import { Decimal, Xml2JsToolkit } from '@nfets/core/infrastructure';

import { ensureIntegrationTestsHasValidCertificate } from '@nfets/test/ensure-integration-tests';
import { expectIsRight } from '@nfets/test/expects';
import { TpEmis } from '@nfets/nfe/domain/entities/constants/tp-emis';
import { NfceAuthorizerPipeline, NfceXmlBuilder } from '@nfets/nfe/application';

import type { Emit } from '@nfets/nfe/domain/entities/nfe/inf-nfe/emit';
import type { Ide } from '@nfets/nfe/domain/entities/nfe/inf-nfe/ide';

const SEFAZ_TIMEOUT_SC = 60 * 1000;

describe('nfce authorizer pipeline (integration) (destructive)', () => {
  if (process.env.DESTRUCTIVE_TESTS !== '1') {
    return it.only('destructive tests are disabled', () => void 0);
  }

  const certificateFromEnvironment =
    ensureIntegrationTestsHasValidCertificate();
  if (certificateFromEnvironment === undefined) return;

  const toolkit = new Xml2JsToolkit();
  let pipeline: NfceAuthorizerPipeline;

  beforeAll(() => {
    pipeline = new NfceAuthorizerPipeline({
      pfxPathOrBase64: certificateFromEnvironment.certificatePath,
      password: certificateFromEnvironment.password,
    });
  });

  it(
    'should authorize a nfce',
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

      const args = JSON.parse(process.env.TEST_PAYLOAD ?? '{}') as Partial<
        Emit & Ide
      >;
      const ufAcronym = (args.enderEmit?.UF ?? '') as StateAcronym;

      const builder = NfceXmlBuilder.create(toolkit)
        .infNFe({ versao: '4.00' })
        .ide({
          cUF: StateCodes[ufAcronym],
          cNF: new Date().getTime().toString().slice(0, 8),
          natOp: 'Venda de mercadoria',
          mod: args.mod ?? '65',
          serie: args.serie ?? '',
          nNF: args.nNF ?? '',
          dhEmi: new Date().toISOString(),
          tpNF: '1',
          idDest: '1',
          cMunFG: args.enderEmit?.cMun ?? '',
          tpImp: '4',
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
          xNome: args.xNome ?? 'Emissor Teste LTDA',
          CNPJ: args.CNPJ ?? void 0,
          CPF: args.CPF ?? void 0,
          IE: args.IE ?? 'ISENTO',
          enderEmit: {
            xLgr: 'Rua exemplo',
            nro: 'S/N',
            CEP: args.enderEmit?.CEP ?? '',
            xMun: args.enderEmit?.xMun ?? '',
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
          CNPJ: args.CNPJ ?? '',
          xContato: args.xNome ?? 'Contact',
          email: 'email@example.com',
          fone: args.enderEmit?.fone ?? '49999999999',
        });

      const entityOrLeft = builder.toObject();
      expectIsRight(entityOrLeft);

      const response = await pipeline.execute(
        { NFe: entityOrLeft.value },
        { qrCode: { version: '300' } },
      );
      expectIsRight(response);
      const { retEnviNFe } = response.value.response;
      console.log('response:', JSON.stringify(retEnviNFe, null, 2));

      expect(response.value.xml).toContain('<infNFeSupl><qrCode>');
      expect(response.value.xml).toContain('</qrCode><urlChave>');
      expect(response.value.xml).toContain('</urlChave></infNFeSupl>');

      const infProt = retEnviNFe.protNFe.infProt;
      expect(infProt).toBeDefined();
      expect(infProt.nProt).toBeDefined();
      expect(infProt.cStat).toStrictEqual('100');
      expect(infProt.xMotivo).toStrictEqual('Autorizado o uso da NF-e');
    },
    SEFAZ_TIMEOUT_SC,
  );
});
