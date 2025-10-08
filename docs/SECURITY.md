# Política de Segurança / Security Policy

[English version](./SECURITY.en.md)

## 🔒 Versões Suportadas

Atualmente, fornecemos suporte de segurança para as seguintes versões do nfets:

| Versão | Suportada          |
| ------ | ------------------ |
| 0.x.x  | :white_check_mark: |

## 🚨 Reportando uma Vulnerabilidade

A segurança dos usuários do nfets é nossa prioridade máxima. Agradecemos seus esforços para divulgar suas descobertas de forma responsável.

### Como Reportar

**Por favor, NÃO reporte vulnerabilidades de segurança através de issues públicas.**

Em vez disso:

1. **Use o recurso de Security Advisories do GitHub**
   - Vá para a aba Security do repositório
   - Clique em "Report a vulnerability"
   - Preencha o formulário com detalhes da vulnerabilidade

2. **Ou envie um email** (se o método acima não estiver disponível)
   - Para: gustavo@lidani.dev
   - Assunto: [SECURITY] Descrição breve da vulnerabilidade

### O que Incluir no Reporte

Para nos ajudar a entender melhor a natureza e o escopo do problema, inclua o máximo de informações possível:

- Tipo de vulnerabilidade (ex: injeção de código, XSS, etc.)
- Localização do código afetado (arquivo, linha)
- Configuração especial necessária para reproduzir
- Passos detalhados para reproduzir a vulnerabilidade
- Prova de conceito ou código de exploração (se possível)
- Impacto potencial da vulnerabilidade

### O que Esperar

- **Confirmação**: Você receberá uma confirmação em até 48 horas
- **Análise**: Avaliaremos a vulnerabilidade e determinaremos sua severidade
- **Atualizações**: Manteremos você informado sobre o progresso
- **Correção**: Trabalharemos em uma correção o mais rápido possível
- **Divulgação**: Coordenaremos com você a divulgação pública

## 🛡️ Práticas de Segurança

### Para Desenvolvedores

- Sempre use a versão mais recente do nfets
- Mantenha suas dependências atualizadas
- Nunca comite certificados, chaves privadas ou credenciais
- Use variáveis de ambiente para informações sensíveis
- Valide e sanitize todas as entradas de usuário

### Para Contribuidores

- Revise o código em busca de vulnerabilidades comuns
- Siga as práticas OWASP
- Use ferramentas de análise estática de código
- Escreva testes de segurança quando apropriado

## 🏆 Política de Divulgação Responsável

Acreditamos em divulgação responsável e seguimos estas práticas:

1. Você reporta uma vulnerabilidade de forma privada
2. Nós confirmamos e analisamos o reporte
3. Trabalhamos em uma correção
4. Lançamos a correção
5. Divulgamos publicamente após correção (credito para o descobridor)

## 📜 Vulnerabilidades Conhecidas

Mantemos um registro de vulnerabilidades conhecidas e corrigidas em:
- [Security Advisories](https://github.com/nfets/nfets/security/advisories)

## 🎖️ Hall da Fama de Segurança

Agradecemos aos seguintes pesquisadores de segurança por suas contribuições responsáveis:

<!-- Lista será atualizada conforme reportes são recebidos -->

---

Obrigado por ajudar a manter o nfets e seus usuários seguros! 🙏

