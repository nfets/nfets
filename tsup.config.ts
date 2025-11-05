import { defineConfig } from 'tsup';

export default defineConfig({
  outDir: 'dist',
  clean: true,
  tsconfig: 'tsconfig.json',
  format: ['esm', 'cjs'],
  outExtension: ({ format }) => ({
    dts: '.d.ts',
    js: format === 'cjs' ? '.cjs' : '.mjs',
  }),
  bundle: true,
  target: 'node22',
  platform: 'node',
  minify: true,
  entry: { index: 'lib/index.ts' },
  dts: { entry: { index: 'lib/index.ts' } },
  watch: false,
  sourcemap: 'inline',
});
