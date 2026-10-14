import { Environment } from '@nfets/core/domain';
import { readCertificateRequestForPipelineTests } from '@nfets/test/certificates';
import { ensureIntegrationTestsHasValidCertificate } from '@nfets/test/ensure-integration-tests';
import { expectIsRight } from '@nfets/test/expects';
import { TpEvent } from '@nfets/nfe/domain/entities/constants/tp-event';
import { NfeManifestacaoPipeline } from '@nfets/nfe/application/pipelines/transmission/nfe-manifestacao-pipeline';
import type { TpEventManifestacao } from '@nfets/nfe/domain/entities/events/manifestacao';

const SEFAZ_TIMEOUT_SC = 60 * 1000;

describe('nfe manifestacao pipeline (integration) (destructive)', () => {
  if (process.env.DESTRUCTIVE_TESTS !== '1') {
    return it.only('destructive tests are disabled', () => void 0);
  }

  const certificateFromEnvironment =
    ensureIntegrationTestsHasValidCertificate();
  if (certificateFromEnvironment === undefined) return;

  let pipeline: NfeManifestacaoPipeline;

  beforeAll(() => {
    pipeline = new NfeManifestacaoPipeline(
      readCertificateRequestForPipelineTests(
        certificateFromEnvironment.certificatePath,
        certificateFromEnvironment.password,
      ),
    );
  });

  it(
    'should register the manifestacao in ambiente nacional',
    async () => {
      const args = JSON.parse(process.env.TEST_PAYLOAD ?? '{}') as {
        chNFe: string;
        CNPJ?: string;
        tpEvento?: TpEventManifestacao;
        xJust?: string;
      };
      const tpEvento = args.tpEvento ?? TpEvent.CienciaOperacao;

      const response = await pipeline.execute(
        {
          identification: args.CNPJ ?? '',
          chNFe: args.chNFe,
          tpEvento,
          xJust: args.xJust,
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

      const infEvento = retEnvEvento.retEvento?.infEvento;
      expect(infEvento?.cOrgao).toStrictEqual('91');
      expect(infEvento?.tpEvento).toStrictEqual(tpEvento);
      expect(infEvento?.cStat).toStrictEqual('135');

      expect(response.value.xml).toContain('<procEventoNFe');
    },
    SEFAZ_TIMEOUT_SC,
  );
});
