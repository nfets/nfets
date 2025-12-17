import { StateCodes, Environment } from '@nfets/core/domain';
import { ensureIntegrationTestsHasValidCertificate } from '@nfets/test/ensure-integration-tests';
import { expectIsRight } from '@nfets/test/expects';

import { NfeConsultStatusPipeline } from '@nfets/nfe/application/pipelines/transmission/nfe-consult-status-pipeline';

const SEFAZ_TIMEOUT_SC = 60 * 1000;

describe('nfe consult status pipeline (integration) (destructive)', () => {
  if (process.env.DESTRUCTIVE_TESTS !== '1') {
    return it.only('destructive tests are disabled', () => void 0);
  }

  const certificateFromEnvironment =
    ensureIntegrationTestsHasValidCertificate();
  if (certificateFromEnvironment === undefined) return;

  let pipeline: NfeConsultStatusPipeline;

  beforeAll(() => {
    pipeline = new NfeConsultStatusPipeline({
      pfxPathOrBase64: certificateFromEnvironment.certificatePath,
      password: certificateFromEnvironment.password,
    });
  });

  it(
    'should consult the status of a nfe',
    async () => {
      const payload = { tpAmb: Environment.Homolog, cUF: StateCodes.SC };
      const response = await pipeline.execute(payload);
      console.log(JSON.stringify(response.value, null, 2));
      expectIsRight(response);

      expect(response.value.retConsStatServ).toBeDefined();
      expect(response.value.retConsStatServ.tpAmb).toBe(Environment.Homolog);
      expect(response.value.retConsStatServ.cStat).toBe('107');
      expect(response.value.retConsStatServ.xMotivo).toBe(
        'Servico em Operacao',
      );
      expect(response.value.retConsStatServ.dhRecbto).toBeDefined();
    },
    SEFAZ_TIMEOUT_SC,
  );
});
