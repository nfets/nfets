# 🔄 Pull Request Templates / Templates de Pull Request

Esta pasta contém templates específicos para diferentes tipos de Pull Requests.

This folder contains specific templates for different types of Pull Requests.

## 📋 Templates Disponíveis / Available Templates

### 1. ✨ Feature (feature.md)
Para adicionar novas funcionalidades ao projeto.

For adding new features to the project.

**Quando usar / When to use:**
- Implementação de nova funcionalidade
- Adição de novos módulos ou componentes
- Expansão de capacidades existentes

**Template:** `feature.md`

---

### 2. 🐛 Bug Fix (bugfix.md)
Para correção de bugs.

For bug fixes.

**Quando usar / When to use:**
- Corrigir comportamento incorreto
- Resolver problemas reportados
- Fix de crashes ou erros

**Template:** `bugfix.md`

---

### 3. 📚 Documentation (documentation.md)
Para mudanças relacionadas à documentação.

For documentation-related changes.

**Quando usar / When to use:**
- Adicionar ou melhorar documentação
- Corrigir erros de digitação
- Adicionar exemplos de código
- Atualizar READMEs

**Template:** `documentation.md`

---

### 4. ♻️ Refactor (refactor.md)
Para refatoração de código sem mudanças funcionais.

For code refactoring without functional changes.

**Quando usar / When to use:**
- Melhorar estrutura do código
- Eliminar duplicação
- Aplicar padrões de design
- Melhorar legibilidade

**Template:** `refactor.md`

---

### 5. ⚡️ Performance (performance.md)
Para melhorias de performance.

For performance improvements.

**Quando usar / When to use:**
- Otimizar algoritmos
- Reduzir uso de memória
- Melhorar tempo de execução
- Otimizar queries ou operações

**Template:** `performance.md`

---

### 6. 📝 Default (../PULL_REQUEST_TEMPLATE.md)
Template padrão para PRs gerais.

Default template for general PRs.

**Quando usar / When to use:**
- Quando nenhum dos templates específicos se aplica
- Mudanças mistas
- Pequenas alterações

---

## 🚀 Como Usar / How to Use

### Método 1: Via URL Query String

Ao criar um PR, adicione o parâmetro `template` na URL:

When creating a PR, add the `template` parameter to the URL:

```
https://github.com/[usuario]/nfets/compare/main...sua-branch?template=feature.md
```

Templates disponíveis / Available templates:
- `?template=feature.md`
- `?template=bugfix.md`
- `?template=documentation.md`
- `?template=refactor.md`
- `?template=performance.md`

### Método 2: Copiar Manualmente

1. Abra o template apropriado nesta pasta
2. Copie o conteúdo
3. Cole no corpo do seu PR
4. Preencha os campos

### Método 3: CLI (GitHub CLI)

```bash
# Criar PR com template específico
gh pr create --template feature.md

# Ou especificar o caminho completo
gh pr create --template docs/PULL_REQUEST_TEMPLATE/feature.md
```

## 📝 Estrutura dos Templates

Todos os templates incluem:

All templates include:

- ✅ **Descrição clara / Clear description** - O que mudou
- 🎯 **Motivação / Motivation** - Por que mudou
- 🔗 **Issue relacionada / Related issue** - Link para issue
- 🧪 **Como testar / How to test** - Passos de verificação
- ✅ **Checklist** - Verificações obrigatórias
- 📝 **Notas adicionais / Additional notes** - Contexto extra

## 🎨 Personalizando Templates

Para adicionar um novo template:

To add a new template:

1. Crie um arquivo `.md` nesta pasta
2. Siga a estrutura dos templates existentes
3. Use formato bilíngue (PT-BR/EN) quando possível
4. Adicione à lista de templates neste README

### Estrutura Sugerida

```markdown
## Tipo de PR

### 📝 Descrição / Description

### 🎯 Motivação / Motivation

### 🔗 Issue Relacionada / Related Issue

### 🧪 Como Testar / How to Test

### ✅ Checklist

### 📝 Notas Adicionais / Additional Notes
```

## 📚 Boas Práticas / Best Practices

### Para Autores de PR / For PR Authors

- ✅ Use o template mais apropriado
- ✅ Preencha todos os campos obrigatórios
- ✅ Seja específico e detalhado
- ✅ Adicione testes quando aplicável
- ✅ Mantenha PRs focados (uma mudança por vez)
- ✅ Atualize a documentação se necessário
- ✅ Siga Conventional Commits

### Para Revisores / For Reviewers

- ✅ Verifique se o template foi preenchido
- ✅ Confirme que todos os itens do checklist foram marcados
- ✅ Teste as mudanças localmente
- ✅ Revise código e testes
- ✅ Dê feedback construtivo

## 🔗 Recursos / Resources

- [GitHub PR Templates Documentation](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [nfets Contributing Guide](../CONTRIBUTING.md)

---

Feito com 💚 pela comunidade nfets / Made with 💚 by the nfets community

