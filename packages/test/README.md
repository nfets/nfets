# @nfets/test

Pacote de utilitários e testes de integração para o ecossistema nfets.

## Estrutura

- `src/certificates.ts` - Helpers para certificados de teste
- `src/expects.ts` - Expectativas customizadas para testes
- `src/integration.spec.ts` - Testes de estrutura dos pacotes
- `src/integration-usage.spec.ts` - Testes de uso real (simulação end-user)
- `src/jest.config.ts` - Configuração base do Jest
- `jest.config.integration.ts` - Configuração específica para testes de integração

## Testes de Integração

Os testes de integração validam que os pacotes publicados funcionam corretamente como os desenvolvedores finais irão usá-los.

### O que é testado?

#### 1. Estrutura dos Pacotes (`integration.spec.ts`)

- **nfets (pacote full)** - Valida que todas as exportações estão disponíveis
- **@nfets/core** - Valida exportações de assinatura, validadores, infraestrutura
- **@nfets/nfe** - Valida exportações de builders e DTOs
- **Definições de tipos** - Verifica arquivos `.d.ts` e `.d.ts.map`
- **package.json** - Valida configuração de exports

#### 2. Uso Real (`integration-usage.spec.ts`)

- **Criação de instâncias** - Testa que classes podem ser instanciadas
- **API pública** - Verifica que métodos públicos estão disponíveis
- **Integração entre pacotes** - Testa que @nfets/core e @nfets/nfe funcionam juntos
- **Tipos Either** - Valida functors e monads
- **Decorators** - Testa validadores e transformadores

### Como rodar os testes

```bash
# Na raiz do projeto
make test

# Ou diretamente no pacote test
cd packages/test
pnpm test
```

### Build completo + Testes de Integração

```bash
make build:test
```

Este comando:

1. Limpa caches e dist folders
2. Compila todos os pacotes
3. Roda os testes de integração simulando instalação real

## Cenários Testados

### 1. Instalação do pacote `nfets` (full)

Simula: `npm install nfets`

```typescript
import { Signer, NfeXmlBuilder, AccessKeyBuilder } from 'nfets';
```

### 2. Instalação do `@nfets/core`

Simula: `npm install @nfets/core`

```typescript
import { Signer, NativeCertificateRepository } from '@nfets/core';
```

### 3. Instalação do `@nfets/nfe`

Simula: `npm install @nfets/nfe`

```typescript
import { NfeXmlBuilder, AccessKeyBuilder } from '@nfets/nfe';
```

## Importância

Estes testes garantem que:

✅ Os arquivos compilados em `dist/` estão corretos
✅ As definições de tipos (.d.ts) estão disponíveis
✅ Os exports no package.json estão corretos
✅ Os pacotes podem ser usados como dependências reais
✅ A integração entre @nfets/core e @nfets/nfe funciona
✅ Não há imports quebrados ou referências circulares

## Quando rodar

- **Antes de publicar** uma nova versão
- **Após mudanças nos tsconfig** (como acabamos de fazer)
- **Após refatorações** que alterem exports
- **Em CI/CD** antes do deploy

## Estrutura de Imports

Os testes usam imports dinâmicos dos arquivos compilados:

```typescript
const corePath = path.resolve(__dirname, '../../core/dist/index.js');
const core = await import(corePath);
```

Isso simula exatamente como um usuário final importaria o pacote após instalação.
