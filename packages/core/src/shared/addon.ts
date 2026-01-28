import { arch, platform } from 'node:os';
import { dirname, join, resolve, normalize, delimiter } from 'node:path';
import { getRequireFn } from './resolve-requires';
import { search } from './search-file';

const normalizePath = (path: string): string => {
  const normalized = path.replace(/^\\\\\?\\/, '');
  return resolve(normalize(normalized));
};

// On Windows, native .node addons load DLL dependencies from the addon's directory.
// Prepend that directory to PATH so libxml2, libiconv, zlib etc. are found when packaged.
const addAddonDirToPath = (path: string): void => {
  if (platform() !== 'win32') return;
  process.env.PATH = `${dirname(path)}${delimiter}${process.env.PATH}`;
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
const exportRequireModule = <T>(module: string): T => {
  const normalized = normalizePath(module);
  addAddonDirToPath(normalized);
  return getRequireFn()(normalized) as T;
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export const addon = <T>(bin: string): T => {
  bin = `${bin}.node`;

  if (process.env.NFETS_ADDONS_DIR) {
    return exportRequireModule<T>(join(process.env.NFETS_ADDONS_DIR, bin));
  }

  const folder = `${platform()}-${arch()}`;

  try {
    return search<T>(`build/addons/${folder}/${bin}`, {
      onFound: (path) => exportRequireModule<T>(path),
      onNotFound: () => {
        throw new Error(`Addon ${folder}/${bin} not found`);
      },
    });
  } catch {
    return search<T>(`build/Release/${bin}`, {
      onFound: (path) => exportRequireModule<T>(path),
      onNotFound: () => {
        throw new Error(`Addon ${folder}/${bin} not found`);
      },
    });
  }
};
