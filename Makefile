.PHONY: build

lint:
	@pnpm eslint -c eslint.config.mjs

clean:
	@pnpm rimraf packages/{core,nfe}/{tsconfig.build.tsbuildinfo,dist} tsconfig.build.tsbuildinfo dist

test:
	@pnpm test
	@pnpm test:integration

test\:coverage-summary:
	@pnpm test:coverage
	@pnpm test:integration

build:
	@make clean
	@pnpm build && pnpm build:nfets
