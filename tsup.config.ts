import { defineConfig } from 'tsup';

const addDayjsPluginExtensions = () =>
  ({
    name: 'add-dayjs-plugin-extensions',
    renderChunk(this: { format: string }, code: string) {
      if (this.format !== 'esm') return { code, map: null };
      code = code
        .replace(/(['"])dayjs\/plugin\/utc\1/g, '$1dayjs/plugin/utc.js$1')
        .replace(
          /(['"])dayjs\/plugin\/timezone\1/g,
          '$1dayjs/plugin/timezone.js$1',
        );
      return { code, map: null };
    },
  } as const);

const addCreateRequireBanner = () =>
  ({
    name: 'add-create-require-banner',
    renderChunk(this: { format: string }, code: string) {
      if (this.format !== 'esm') return { code, map: null };
      const banner =
        "import { createRequire } from 'module'; const require = createRequire(import.meta.url);";
      return { code: `${banner}\n${code}`, map: null };
    },
  } as const);

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
  sourcemap: false,
  plugins: [addDayjsPluginExtensions(), addCreateRequireBanner()],
});
