import { defineConfig } from 'tsup';

export default defineConfig({
  outDir: 'dist',
  clean: true,
  tsconfig: 'tsconfig.build.json',
  format: ['esm', 'cjs'],
  outExtension: ({ format }) => ({
    dts: '.d.ts',
    js: format === 'cjs' ? '.cjs' : '.mjs',
  }),
  bundle: true,
  target: 'node22',
  platform: 'node',
  minify: true,
  entry: ['lib/index.ts', 'lib/core/index.ts', 'lib/nfe/index.ts'],
  dts: { entry: ['lib/index.ts', 'lib/core/index.ts', 'lib/nfe/index.ts'] },
  watch: false,
  sourcemap: 'inline',
});
