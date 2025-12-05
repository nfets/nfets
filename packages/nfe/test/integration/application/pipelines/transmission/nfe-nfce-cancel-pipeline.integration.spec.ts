import { Environment } from '@nfets/core/domain';
import { ensureIntegrationTestsHasValidCertificate } from '@nfets/test/ensure-integration-tests';
import { expectIsRight } from '@nfets/test/expects';
import { NfeNfceCancelPipeline } from '@nfets/nfe/application/pipelines/transmission/nfe-nfce-cancel-pipeline';

const SEFAZ_TIMEOUT_SC = 60 * 1000;

describe('nfe nfce cancel pipeline (integration) (destructive)', () => {
  if (process.env.DESTRUCTIVE_TESTS !== '1') {
    return it.only('destructive tests are disabled', () => void 0);
  }

  const certificateFromEnvironment =
    ensureIntegrationTestsHasValidCertificate();
  if (certificateFromEnvironment === undefined) return;

  let pipeline: NfeNfceCancelPipeline;

  beforeAll(() => {
    pipeline = new NfeNfceCancelPipeline({
      pfxPathOrBase64: certificateFromEnvironment.certificatePath,
      password: certificateFromEnvironment.password,
    });
  });

  it(
    'should cancel a nfe',
    async () => {
      const args = JSON.parse(process.env.TEST_PAYLOAD ?? '{}') as {
        chNFe: string;
        xJust: string;
        nProt: string;
      };

      const response = await pipeline.execute(
        { chNFe: args.chNFe, xJust: args.xJust, nProt: args.nProt },
        { tpAmb: Environment.Homolog },
      );
      expectIsRight(response);
      console.log(
        'response:',
        JSON.stringify(response.value.retEnvEvento, null, 2),
      );

      const retEnvEvento = response.value.retEnvEvento;
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
    },
    SEFAZ_TIMEOUT_SC,
  );
});
