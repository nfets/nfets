import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

export const addon = (bin: string) => {
  if (process.env.NFETS_ADDONS_DIR) {
    return join(process.env.NFETS_ADDONS_DIR, bin);
  }

  const current = dirname(fileURLToPath(import.meta.url));

  const root = resolve(current, '../../../../');
  const build = join(root, 'build', 'Release', bin);

  if (existsSync(build)) return build;
  let search = current;

  for (let i = 0; i < 10; i++) {
    const candidate = join(search, 'build', 'Release', bin);
    if (existsSync(candidate)) return candidate;

    const parent = dirname(search);
    if (parent === search) break;
    search = parent;
  }

  throw new Error(`Addon ${bin} not found`);
};
