import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Options } from 'tsup';
import type { Plugin } from 'esbuild';

const root = path.dirname(fileURLToPath(import.meta.url));
const nfeSrc = path.resolve(root, '../nfe/src');
const coreSrc = path.resolve(root, '../core/src');

const resolveWorkspacePackage = (
  name: '@nfets/nfe' | '@nfets/core',
  srcRoot: string,
): Plugin => ({
  name: `resolve-${name}`,
  setup(build) {
    const filter = new RegExp(`^${name.replace('/', '\\/')}(\\/.*)?$`);
    build.onResolve({ filter }, (args) => {
      if (args.path === '@nfets/core/domain') {
        return { path: path.resolve(root, 'src/shims/core-domain.ts') };
      }
      if (args.path === '@nfets/core') {
        return { path: path.resolve(root, 'src/shims/core.ts') };
      }

      const subpath = args.path.slice(name.length).replace(/^\//, '');
      if (!subpath) {
        return { path: path.join(srcRoot, 'index.ts') };
      }

      const candidates = [
        path.join(srcRoot, `${subpath}.ts`),
        path.join(srcRoot, subpath, 'index.ts'),
      ];

      for (const candidate of candidates) {
        if (fs.existsSync(candidate)) {
          return { path: candidate };
        }
      }

      return { path: candidates[0] };
    });
  },
});

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  clean: true,
  format: ['esm', 'cjs'],
  dts: true,
  bundle: true,
  splitting: false,
  sourcemap: false,
  minify: false,
  treeshake: true,
  target: 'es2022',
  platform: 'neutral',
  tsconfig: 'tsconfig.json',
  outExtension: ({ format }) => ({
    js: format === 'cjs' ? '.cjs' : '.js',
  }),
  esbuildPlugins: [
    resolveWorkspacePackage('@nfets/nfe', nfeSrc),
    resolveWorkspacePackage('@nfets/core', coreSrc),
  ],
} satisfies Options);
