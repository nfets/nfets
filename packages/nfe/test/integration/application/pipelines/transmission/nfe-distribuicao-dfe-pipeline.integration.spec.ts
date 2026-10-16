import { Environment, StateCodes, type StateCode } from '@nfets/core/domain';
import { readCertificateRequestForPipelineTests } from '@nfets/test/certificates';
import { ensureIntegrationTestsHasValidCertificate } from '@nfets/test/ensure-integration-tests';
import { expectIsRight } from '@nfets/test/expects';
import { NfeDistribuicaoDFePipeline } from '@nfets/nfe/application/pipelines/transmission/nfe-distribuicao-dfe-pipeline';

const SEFAZ_TIMEOUT_SC = 60 * 1000;

describe('nfe distribuicao dfe pipeline (integration) (not destructive)', () => {
  const certificateFromEnvironment =
    ensureIntegrationTestsHasValidCertificate();
  if (certificateFromEnvironment === undefined) return;

  const payload = JSON.parse(process.env.TEST_PAYLOAD ?? '{}') as {
    chNFe?: string;
    CNPJ?: string;
    cUFAutor?: StateCode;
  };
  if (!payload.chNFe || !payload.CNPJ) {
    it.skip('set TEST_PAYLOAD with chNFe and CNPJ to consult distribuicao DF-e', () =>
      void 0);
    return;
  }

  let pipeline: NfeDistribuicaoDFePipeline;

  beforeAll(() => {
    pipeline = new NfeDistribuicaoDFePipeline(
      readCertificateRequestForPipelineTests(
        certificateFromEnvironment.certificatePath,
        certificateFromEnvironment.password,
      ),
    );
  });

  it(
    'should consult an access key in ambiente nacional',
    async () => {
      const response = await pipeline.execute(
        {
          identification: payload.CNPJ ?? '',
          chNFe: payload.chNFe ?? '',
          cUFAutor: payload.cUFAutor ?? StateCodes.SC,
        },
        { tpAmb: Environment.Homolog },
      );
      expectIsRight(response);
      console.log('response:', JSON.stringify(response.value, null, 2));

      expect(response.value.response.cStat).toMatch(/^\d{3}$/);
      expect(response.value.response.xMotivo).toBeDefined();
    },
    SEFAZ_TIMEOUT_SC,
  );
});
