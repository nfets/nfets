lint:
	@pnpm eslint -c eslint.config.mjs

clean:
	@pnpm rimraf packages/{core,nfe,transmission}/{tsconfig.tsbuildinfo,dist}

test:
	@pnpm --filter @nfets/* test

build:
	@make clean
	@pnpm tsx scripts/build.ts

build\:core:
	@pnpm --filter @nfets/core build

build\:nfe:
	@pnpm --filter @nfets/nfe build

build\:transmission:
	@pnpm --filter @nfets/transmission build