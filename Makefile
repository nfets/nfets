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

install:
	@pnpm install --frozen-lockfile

addon:
	@npx --yes node-gyp@12.1.0 rebuild --arch=$(or $(ARCH),)

build:
	@make clean
	@pnpm build
