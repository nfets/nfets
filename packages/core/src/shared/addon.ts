import { arch, platform } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { getCurrentFile, getRequireFn } from './resolve-requires';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
const exportRequireModule = <T>(module: string): T => {
  return getRequireFn()(module) as T;
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const addon = <T>(bin: string): T => {
  bin = `${bin}.node`;
  const folder = `${platform()}-${arch()}`;

  if (process.env.NFETS_ADDONS_DIR) {
    return exportRequireModule<T>(join(process.env.NFETS_ADDONS_DIR, bin));
  }

  const current = getCurrentFile();

  const root = resolve(current, '../../../../');
  const build = join(root, 'build', 'addons', folder, bin);

  if (existsSync(build)) return exportRequireModule<T>(build);

  // distribution
  let search = current;
  for (let i = 0; i < 5; i++) {
    const candidate = join(search, 'build', 'addons', folder, bin);
    if (existsSync(candidate)) return exportRequireModule<T>(candidate);

    const parent = dirname(search);
    if (parent === search) break;
    search = parent;
  }

  // distribution fallback
  search = current;
  for (let i = 0; i < 5; i++) {
    const candidate = join(
      search,
      'node_modules',
      'nfets',
      'build',
      'addons',
      folder,
      bin,
    );

    if (existsSync(candidate)) return exportRequireModule<T>(candidate);

    const parent = dirname(search);
    if (parent === search) break;
    search = parent;
  }

  // dev-time
  search = current;
  for (let i = 0; i < 5; i++) {
    const candidate = join(search, 'build', 'Release', bin);
    if (existsSync(candidate)) return exportRequireModule<T>(candidate);

    const parent = dirname(search);
    if (parent === search) break;
    search = parent;
  }

  throw new Error(`Addon ${folder}/${bin} not found`);
};
