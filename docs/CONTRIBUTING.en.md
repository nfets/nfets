# Contributing to nfets

[Versão em Português](./CONTRIBUTING.md)

Thank you for considering contributing to nfets! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Guidelines](#development-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Conventions](#code-conventions)

## 📜 Code of Conduct

This project and all participants are subject to our [Code of Conduct](./CODE_OF_CONDUCT.en.md). By participating, you are expected to uphold this code.

## 🤝 How Can I Contribute?

### Reporting Bugs

- Use the appropriate issue templates
- Describe the problem clearly and in detail
- Include code examples when possible
- Describe expected vs. actual behavior

### Suggesting Enhancements

- Use the feature request template
- Explain why this enhancement would be useful
- Provide usage examples when applicable

### Pull Requests

- Fill in the PR template
- Follow the project's code conventions
- Include tests for new features
- Update documentation when necessary

## 🛠 Development Guidelines

### Environment Setup

```bash
# Clone the repository
git clone git@github.com:nfets/nfets.git
cd nfets

# Install dependencies
pnpm install

# Run tests
pnpm test
```

### Architecture

This project follows the principles of:

- **Clean Architecture**
- **Domain-Driven Design (DDD)**
- **Dependency Inversion**
- **SOLID Principles**

### Package Structure

- `packages/core` - Core functionality (signing, certificates, etc.)
- `packages/nfe` - NFe/NFCe specific implementation
- `packages/test` - Shared test utilities

## 🔄 Pull Request Process

1. **Fork** the repository
2. Create a **branch** from `main` (`git checkout -b feature/my-feature`)
3. **Commit** your changes (`git commit -m 'feat: add new feature'`)
4. **Push** to the branch (`git push origin feature/my-feature`)
5. Open a **Pull Request**

### Commits

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `test:` - Tests
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks
- `style:` - Code formatting

## 💻 Code Conventions

### TypeScript

- Use TypeScript strict mode
- Prefer interfaces over types when possible
- Use explicit types for public parameters
- Avoid `any`, use `unknown` when needed

### Tests

- Write unit tests for all business logic
- Maintain code coverage > 80%
- Use descriptive test names
- Follow the AAA pattern (Arrange, Act, Assert)

### Naming

- Use **PascalCase** for classes and interfaces
- Use **camelCase** for variables and functions
- Use **UPPER_SNAKE_CASE** for constants
- Descriptive names in English for code

## 🧪 Running Tests

```bash
# All tests
make test

# Tests for a specific package
pnpm --filter @nfets/core test

# Coverage
make test:coverage-summary
```

## 📝 Documentation

- Keep README updated
- Add usage examples when applicable
- Document breaking changes

## ❓ Questions?

If you have questions, check:

- [Documentation](../README.md)
- [Open Issues](https://github.com/nfets/nfets/issues)
- [Discussions](https://github.com/nfets/nfets/discussions)

---

Thank you for contributing! 💚
