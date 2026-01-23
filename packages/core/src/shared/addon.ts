import { arch, platform } from 'node:os';
import { join } from 'node:path';
import { getRequireFn } from './resolve-requires';
import { search } from './search-file';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
const exportRequireModule = <T>(module: string): T => {
  return getRequireFn()(module) as T;
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const addon = <T>(bin: string): T => {
  bin = `${bin}.node`;

  if (process.env.NFETS_ADDONS_DIR) {
    return exportRequireModule<T>(join(process.env.NFETS_ADDONS_DIR, bin));
  }

  try {
    return search<T>(`build/Release/${bin}`, {
      onFound: (path) => exportRequireModule<T>(path),
      onNotFound: () => {
        throw new Error(`Addon ${bin} not found`);
      },
    });
  } catch {
    const folder = `${platform()}-${arch()}`;
    return search<T>(`build/addons/${folder}/${bin}`, {
      onFound: (path) => exportRequireModule<T>(path),
      onNotFound: () => {
        throw new Error(`Addon ${folder}/${bin} not found`);
      },
    });
  }
};
