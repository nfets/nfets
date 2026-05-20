# nfets — Constituição do Módulo

> SDK NF-e em TypeScript. Monorepo pnpm com binding nativo para Windows (wincrypt). Pacotes: core, nfe, test.

## Identidade
- Módulo: nfets — SDK NF-e em TypeScript (monorepo)
- Parte do monorepo: zweb-projects

## Stack
- **Linguagem:** Node.js + TypeScript 5
- **Estrutura:** pnpm workspaces (monorepo)
- **Pacotes:** `@nfets/core` · `@nfets/nfe` · `@nfets/test`
- **Binding nativo:** node-gyp — addon `wincrypt_certificate_store` (apenas Windows)
- **Dependências core:** `@xmldom/xmldom`, `decimal.js`, `node-forge`, `soap`, `xml-core`, `xml2js`, `xmldsigjs`
- **NF-e:** `@nfets/core` + `qrcode`
- **Build:** tsup
- **Testes:** Jest (por pacote, `--experimental-vm-modules`)
- **Lint:** ESLint (eslint.config.mjs)
- **Gerenciador:** pnpm
- **CI:** GitHub Actions

## Estrutura de pastas
```
nfets/
├── packages/
│   ├── core/       # Núcleo: assinatura XML, comunicação SEFAZ, certificados
│   ├── nfe/        # Pacote NF-e: geração, transmissão, QR Code
│   └── test/       # Fixtures e helpers de teste compartilhados
├── addons/         # Código C++ do binding nativo (wincrypt — Windows only)
├── lib/            # Saída do binding compilado
├── dist/           # Saída do tsup
└── tsup.config.ts  # Configuração de build
```

## Comandos do projeto
```bash
# Instalar dependências (inclui compilação do addon nativo)
pnpm install

# Build de todos os pacotes
pnpm build

# Executar testes (todos os pacotes)
pnpm test

# Testes com cobertura
pnpm test:coverage

# Type check (todos os pacotes)
pnpm typecheck
```

## Restrições
- Usar pnpm, não yarn/npm
- O addon nativo (`wincrypt_certificate_store`) compila apenas em Windows — builds no Linux/macOS ignoram com aviso
- Certificados digitais (A1/A3) e chaves privadas nunca em logs ou código-fonte
- Comunicação com SEFAZ não pode ser quebrada — testar contra ambiente de homologação antes de deploy
- Schemas XSD normativos — não alterar sem validação fiscal
