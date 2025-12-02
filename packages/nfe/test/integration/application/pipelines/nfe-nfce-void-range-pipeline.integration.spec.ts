import { Environment, StateCodes, type StateAcronym } from '@nfets/core/domain';
import { ensureIntegrationTestsHasValidCertificate } from '@nfets/test/ensure-integration-tests';
import { expectIsRight } from '@nfets/test/expects';
import { NfeNfceVoidRangePipeline } from '@nfets/nfe/application/pipelines/nfe-nfce-void-range-pipeline';

const SEFAZ_TIMEOUT_SC = 60 * 1000;

describe('nfe nfce void range (inutilização) pipeline (integration) (destructive)', () => {
  if (process.env.DESTRUCTIVE_TESTS !== '1') {
    return it.only('destructive tests are disabled', () => void 0);
  }

  const certificateFromEnvironment =
    ensureIntegrationTestsHasValidCertificate();
  if (certificateFromEnvironment === undefined) return;

  let pipeline: NfeNfceVoidRangePipeline;

  beforeAll(() => {
    pipeline = new NfeNfceVoidRangePipeline({
      pfxPathOrBase64: certificateFromEnvironment.certificatePath,
      password: certificateFromEnvironment.password,
    });
  });

  it(
    'should void a range of nfe',
    async () => {
      const args = JSON.parse(process.env.TEST_PAYLOAD ?? '{}') as {
        UF: StateAcronym;
        mod: string;
        serie: string;
        nNFIni: string;
        nNFFin: string;
        xJust: string;
      };

      const response = await pipeline.execute(
        {
          mod: args.mod,
          serie: args.serie,
          nNFIni: args.nNFIni,
          nNFFin: args.nNFFin,
          xJust: args.xJust,
        },
        { cUF: StateCodes[args.UF], tpAmb: Environment.Homolog },
      );
      expectIsRight(response);
      console.log(
        'response:',
        JSON.stringify(response.value.retInutNFe, null, 2),
      );

      const infInut = response.value.retInutNFe.infInut;
      expect(infInut.cStat).toBe('102');
      expect(infInut.xMotivo).toBe('Inutilizacao de numero homologado');
      expect(infInut.mod).toBe(args.mod);
      expect(infInut.serie).toBe(args.serie);
      expect(infInut.nNFIni).toBe(args.nNFIni);
      expect(infInut.nNFFin).toBe(args.nNFFin);
    },
    SEFAZ_TIMEOUT_SC,
  );
});
