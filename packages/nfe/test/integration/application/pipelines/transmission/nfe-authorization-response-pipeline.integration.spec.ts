import { StateCodes, Environment } from '@nfets/core/domain';
import { ensureIntegrationTestsHasValidCertificate } from '@nfets/test/ensure-integration-tests';
import { expectIsRight } from '@nfets/test/expects';

import { NfeAuthorizationResponsePipeline } from '@nfets/nfe/application/pipelines/transmission/nfe-authorization-response-pipeline';

const SEFAZ_TIMEOUT_SC = 60 * 1000;

describe('nfe authorization response pipeline (integration) (destructive)', () => {
  if (process.env.DESTRUCTIVE_TESTS !== '1') {
    return it.only('destructive tests are disabled', () => void 0);
  }

  const certificateFromEnvironment =
    ensureIntegrationTestsHasValidCertificate();
  if (certificateFromEnvironment === undefined) return;

  let pipeline: NfeAuthorizationResponsePipeline;

  beforeAll(() => {
    pipeline = new NfeAuthorizationResponsePipeline({
      pfxPathOrBase64: certificateFromEnvironment.certificatePath,
      password: certificateFromEnvironment.password,
    });
  });

  it(
    'should return the authorization response of a nfe',
    async () => {
      const args = JSON.parse(process.env.TEST_PAYLOAD ?? '{}') as Partial<{
        nRec: string;
      }>;

      const responseOrLeft = await pipeline.execute({
        tpAmb: Environment.Homolog,
        cUF: StateCodes.SC,
        nRec: args.nRec ?? '',
      });

      console.log(JSON.stringify(responseOrLeft.value, null, 2));
      expectIsRight(responseOrLeft);

      expect(responseOrLeft.value.retConsReciNFe).toBeDefined();
      expect(responseOrLeft.value.retConsReciNFe.tpAmb).toBe(
        Environment.Homolog,
      );
    },
    SEFAZ_TIMEOUT_SC,
  );
});
