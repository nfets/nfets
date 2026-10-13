import { Environment } from '@nfets/core/domain';
import { readCertificateRequestForPipelineTests } from '@nfets/test/certificates';
import { ensureIntegrationTestsHasValidCertificate } from '@nfets/test/ensure-integration-tests';
import { expectIsRight } from '@nfets/test/expects';
import { TpEvent } from '@nfets/nfe/domain/entities/constants/tp-event';
import { NfeCienciaOperacaoPipeline } from '@nfets/nfe/application/pipelines/transmission/nfe-ciencia-operacao-pipeline';

const SEFAZ_TIMEOUT_SC = 60 * 1000;

describe('nfe ciencia operacao pipeline (integration) (destructive)', () => {
  if (process.env.DESTRUCTIVE_TESTS !== '1') {
    return it.only('destructive tests are disabled', () => void 0);
  }

  const certificateFromEnvironment =
    ensureIntegrationTestsHasValidCertificate();
  if (certificateFromEnvironment === undefined) return;

  let pipeline: NfeCienciaOperacaoPipeline;

  beforeAll(() => {
    pipeline = new NfeCienciaOperacaoPipeline(
      readCertificateRequestForPipelineTests(
        certificateFromEnvironment.certificatePath,
        certificateFromEnvironment.password,
      ),
    );
  });

  it(
    'should register ciencia da operacao in ambiente nacional',
    async () => {
      const args = JSON.parse(process.env.TEST_PAYLOAD ?? '{}') as {
        chNFe: string;
        CNPJ?: string;
      };

      const response = await pipeline.execute(
        { identification: args.CNPJ ?? '', chNFe: args.chNFe },
        { tpAmb: Environment.Homolog },
      );
      expectIsRight(response);
      console.log(
        'response:',
        JSON.stringify(response.value.response.retEnvEvento, null, 2),
      );

      const retEnvEvento = response.value.response.retEnvEvento;
      expect(retEnvEvento.cStat).toStrictEqual('128');

      const infEvento = retEnvEvento.retEvento?.infEvento;
      expect(infEvento?.cOrgao).toStrictEqual('91');
      expect(infEvento?.tpEvento).toStrictEqual(TpEvent.CienciaOperacao);
      expect(infEvento?.cStat).toStrictEqual('135');

      expect(response.value.xml).toContain('<procEventoNFe');
    },
    SEFAZ_TIMEOUT_SC,
  );
});
