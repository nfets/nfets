.PHONY: build

lint:
	@pnpm eslint -c eslint.config.mjs

clean:
	@pnpm rimraf packages/{core,nfe,validators}/{tsconfig.build.tsbuildinfo,dist}

test:
	@pnpm --filter @nfets/* test

test\:coverage-summary:
	@pnpm --filter @nfets/* test:coverage --coverageReporters=\"json-summary\"

build:
	@make clean
	@pnpm build

build\:core:
	@pnpm --filter @nfets/core build

build\:nfe:
	@pnpm --filter @nfets/nfe build

build\:validators:
	@pnpm --filter @nfets/validators build
