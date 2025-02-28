.PHONY: build

lint:
	@pnpm eslint -c eslint.config.mjs

install:
	@pnpm exec rimraf node_modules packages/{core,nfe}/node_modules \
		&& pnpm install

clean:
	@pnpm exec rimraf packages/{core,nfe}/{tsconfig.tsbuildinfo,dist}

test:
	@pnpm --filter @nfets/* test

build:
	@make clean
	@pnpm tsx scripts/build.ts

build\:core:
	@pnpm --filter @nfets/core build

build\:nfe:
	@pnpm --filter @nfets/nfe build
