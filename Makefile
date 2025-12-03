.PHONY: build

lint:
	@pnpm eslint -c eslint.config.mjs

clean:
	@pnpm rimraf packages/{core,nfe}/{tsconfig.build.tsbuildinfo,dist} tsconfig.build.tsbuildinfo dist

test:
	@pnpm test

typecheck:
	@pnpm typecheck

test\:coverage-summary:
	@pnpm test:coverage

build:
	@make clean
	@pnpm build

dev\:install:
	@pnpm install --frozen-lockfile
	@npx --yes node-gyp rebuild
