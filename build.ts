console.log('asdasda');

const response = await Bun.build({
  entrypoints: [
    './packages/core/src/index.ts',
    './packages/nfe/src/index.ts',
    // './packages/transmission/src/index.ts',
  ],
  outdir: './dist',
  target: 'node',
  packages: 'external',
});

console.log({ response });
