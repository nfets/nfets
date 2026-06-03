import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const packageRoot = join(__dirname, '../../../..');
const distRoot = join(packageRoot, 'dist');
const requireFromPackage = createRequire(join(packageRoot, 'package.json'));

const describeIfBuilt = existsSync(join(distRoot, 'core/index.cjs'))
  ? describe
  : describe.skip;

describeIfBuilt('published bundle transmission errors (dist)', () => {
  it('should keep transmission error classes only in nfets/core', () => {
    const nfeBundle = readFileSync(join(distRoot, 'nfe/index.cjs'), 'utf8');

    expect(nfeBundle).toMatch(/nfets\/core/);
    expect(nfeBundle).not.toMatch(
      /static\{o\(this,"TransmissionTimeoutError"\)\}/,
    );
  });

  it('should share TransmissionTimeoutError between nfets/core and nfets/nfe', () => {
    const core = requireFromPackage(
      './dist/core/index.cjs',
      // @ts-expect-error no types for import('nfets/core')
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    ) as typeof import('nfets/core');
    const coreFromNfeResolution = requireFromPackage(
      requireFromPackage.resolve('nfets/core', {
        paths: [join(distRoot, 'nfe'), packageRoot],
      }),
      // @ts-expect-error no types for import('nfets/core')
      // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    ) as typeof import('nfets/core');

    expect(coreFromNfeResolution.TransmissionTimeoutError).toBe(
      core.TransmissionTimeoutError,
    );
    expect(coreFromNfeResolution.TransmissionError).toBe(
      core.TransmissionError,
    );

    const axiosTimeout = Object.assign(
      new Error('timeout of 5000ms exceeded'),
      { code: 'ECONNABORTED' },
    );

    const timeoutError = new coreFromNfeResolution.TransmissionTimeoutError(
      axiosTimeout.message,
      { cause: axiosTimeout },
    );

    expect(timeoutError).toBeInstanceOf(core.TransmissionTimeoutError);
    expect(timeoutError).toBeInstanceOf(core.TransmissionError);
  });
});
