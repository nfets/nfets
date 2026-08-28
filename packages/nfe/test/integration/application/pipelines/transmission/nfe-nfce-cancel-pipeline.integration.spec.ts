import { Environment } from '@nfets/core/domain';
import { readCertificateRequestForPipelineTests } from '@nfets/test/certificates';
import { ensureIntegrationTestsHasValidCertificate } from '@nfets/test/ensure-integration-tests';
import { expectIsRight } from '@nfets/test/expects';
import { NfeCancelPipeline } from '@nfets/nfe/application/pipelines/transmission/nfe-cancel-pipeline';

const SEFAZ_TIMEOUT_SC = 60 * 1000;

describe('nfe nfce cancel pipeline (integration) (destructive)', () => {
  if (process.env.DESTRUCTIVE_TESTS !== '1') {
    return it.only('destructive tests are disabled', () => void 0);
  }

  const certificateFromEnvironment =
    ensureIntegrationTestsHasValidCertificate();
  if (certificateFromEnvironment === undefined) return;

  let pipeline: NfeCancelPipeline;

  beforeAll(() => {
    pipeline = new NfeCancelPipeline(
      readCertificateRequestForPipelineTests(
        certificateFromEnvironment.certificatePath,
        certificateFromEnvironment.password,
      ),
    );
  });

  it(
    'should cancel a nfe',
    async () => {
      const args = JSON.parse(process.env.TEST_PAYLOAD ?? '{}') as {
        chNFe: string;
        CNPJ?: string;
        xJust: string;
        nProt: string;
      };

      const response = await pipeline.execute(
        {
          identification: args.CNPJ ?? '',
          chNFe: args.chNFe,
          xJust: args.xJust,
          nProt: args.nProt,
        },
        { tpAmb: Environment.Homolog },
      );
      expectIsRight(response);
      console.log(
        'response:',
        JSON.stringify(response.value.response.retEnvEvento, null, 2),
      );

      const retEnvEvento = response.value.response.retEnvEvento;
      expect(retEnvEvento.cStat).toStrictEqual('128');
      expect(retEnvEvento.xMotivo).toStrictEqual('Lote de Evento Processado');

      const infEvento = retEnvEvento.retEvento?.infEvento;
      expect(infEvento).toBeDefined();
      expect(infEvento?.nProt).toBeDefined();
      expect(infEvento?.cStat).toStrictEqual('135');
      expect(infEvento?.tpEvento).toStrictEqual('110111');
      expect(infEvento?.xMotivo).toStrictEqual(
        'Evento registrado e vinculado a NF-e',
      );

      expect(response.value.xml).toBeDefined();
      expect(response.value.xml).toContain('<procEventoNFe');
      expect(response.value.xml).toContain('<evento');
      expect(response.value.xml).toContain('<retEvento');
    },
    SEFAZ_TIMEOUT_SC,
  );
});
