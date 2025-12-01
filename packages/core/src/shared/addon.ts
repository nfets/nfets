import { join, dirname, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { getCurrentFile, getRequireFn } from './resolve-requires';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
const exportRequireModule = <T>(module: string): T => {
  return getRequireFn()(module) as T;
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const addon = <T>(bin: string): T => {
  if (process.env.NFETS_ADDONS_DIR) {
    return exportRequireModule<T>(join(process.env.NFETS_ADDONS_DIR, bin));
  }

  const current = getCurrentFile();

  const root = resolve(current, '../../../../');
  const build = join(root, 'build', 'Release', bin);

  if (existsSync(build)) return exportRequireModule<T>(build);
  let search = current;

  for (let i = 0; i < 10; i++) {
    const candidate = join(search, 'build', 'Release', bin);
    if (existsSync(candidate)) return exportRequireModule<T>(candidate);

    const parent = dirname(search);
    if (parent === search) break;
    search = parent;
  }

  throw new Error(`Addon ${bin} not found`);
};
