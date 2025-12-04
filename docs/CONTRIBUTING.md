# Contribuindo para nfets

[English version](./CONTRIBUTING.en.md)

Obrigado por considerar contribuir para o nfets! 🎉

## 📋 Sumário

- [Código de Conduta](#código-de-conduta)
- [Como Posso Contribuir?](#como-posso-contribuir)
- [Diretrizes de Desenvolvimento](#diretrizes-de-desenvolvimento)
- [Processo de Pull Request](#processo-de-pull-request)
- [Convenções de Código](#convenções-de-código)

## 📜 Código de Conduta

Este projeto e todos os participantes estão sujeitos ao nosso [Código de Conduta](./CODE_OF_CONDUCT.md). Ao participar, espera-se que você siga este código.

## 🤝 Como Posso Contribuir?

### Reportando Bugs

- Use os templates de issue apropriados
- Descreva o problema de forma clara e detalhada
- Inclua exemplos de código quando possível
- Descreva o comportamento esperado vs. o comportamento atual

### Sugerindo Melhorias

- Use o template de feature request
- Explique por que essa melhoria seria útil
- Forneça exemplos de uso quando aplicável

### Pull Requests

- Preencha o template de PR
- Siga as convenções de código do projeto
- Inclua testes para novas funcionalidades
- Atualize a documentação quando necessário

## 🛠 Diretrizes de Desenvolvimento

### Configuração do Ambiente

```bash
# Clone o repositório
git clone git@github.com:nfets/nfets.git
cd nfets

# Instale as dependências
make install

# Rebuild addons
make addon

# Build package
make build

# Execute os testes
make test
```

### Arquitetura

Este projeto segue os princípios de:

- **Clean Architecture** (Arquitetura Limpa)
- **Domain-Driven Design (DDD)**
- **Dependency Inversion** (Inversão de Dependências)
- **SOLID Principles**

### Estrutura de Pacotes

- `packages/core` - Funcionalidades principais (assinatura, certificados, etc.)
- `packages/nfe` - Implementação específica para NFe/NFCe
- `packages/test` - Utilitários de teste compartilhados

## 🔄 Processo de Pull Request

1. **Fork** o repositório
2. Crie uma **branch** a partir de `main` (`git checkout -b feature/minha-feature`)
3. **Commit** suas alterações (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/minha-feature`)
5. Abra um **Pull Request**

### Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `test:` - Testes
- `refactor:` - Refatoração de código
- `chore:` - Tarefas de manutenção
- `style:` - Formatação de código

## 💻 Convenções de Código

### TypeScript

- Use TypeScript strict mode
- Prefira interfaces a types quando possível
- Use tipos explícitos para parâmetros públicos
- Evite `any`, use `unknown` quando necessário

### Testes

- Escreva testes unitários para toda lógica de negócio
- Mantenha cobertura de código > 80%
- Use nomes descritivos para testes
- Siga o padrão AAA (Arrange, Act, Assert)

### Nomenclatura

- Use **PascalCase** para classes e interfaces
- Use **camelCase** para variáveis e funções
- Use **UPPER_SNAKE_CASE** para constantes
- Nomes descritivos e em inglês para código

## 🧪 Rodando Testes

```bash
# Todos os testes
make test

# Testes de um pacote específico
pnpm --filter @nfets/core test

# Coverage
make test:coverage-summary
```

## 📝 Documentação

- Mantenha o README atualizado
- Adicione exemplos de uso quando aplicável
- Documente breaking changes

## ❓ Dúvidas?

Se tiver dúvidas, consulte:

- [Documentação](../README.md)
- [Issues abertas](https://github.com/nfets/nfets/issues)
- [Discussions](https://github.com/nfets/nfets/discussions)

---

Obrigado por contribuir! 💚
