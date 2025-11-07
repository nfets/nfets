## Riscos dos testes de integração destrutivos

Executar os cenários dentro do bloco `describe('soap nfe remote transmission (integration) (destructive)')` em `nfe-transmitter.integration.spec.ts` aciona os endpoints reais de homologação da SEFAZ, envia uma NF-e assinada e aguarda autorização. Rodar esses testes sem cautela pode resultar em:

- **Envio involuntário de NF-e**: Cada execução gera um XML real assinado com o seu certificado. Dados de emitente/destinatário incorretos ou execuções repetidas podem poluir a fila da SEFAZ ou expor informações da empresa.
- **Uso intensivo do certificado e limites de requisição**: O certificado configurado via variáveis de ambiente é utilizado para assinar cada chamada. Senhas erradas, certificados expirados ou execuções em paralelo podem bloquear o certificado ou atingir limites de throttling da SEFAZ.
- **Operações irreversíveis**: Após a autorização da NF-e pela SEFAZ, o documento fica registrado. Mesmo que as fixtures representem notas de baixo valor, pode ser necessário realizar inutilização ou cancelamento manual para limpar o ambiente.
- **Exposição de dados sensíveis**: As fixtures extraem informações do emitente diretamente do certificado (nome, CNPJ/CPF, endereço). Usar certificados de desenvolvimento pode expor esses dados em logs ou telemetria.

Antes de executar qualquer comando com o flag `DESTRUCTIVE_TESTS=1`, assegure-se de:

1. Entender o ciclo de vida da NF-e e as obrigações após a autorização.
2. Ter autorização explícita para utilizar o certificado configurado no ambiente de homologação.
3. Proteger segredos para que não vazem em logs ou artefatos de CI.
4. Monitorar as respostas da SEFAZ; falhas podem deixar notas parcialmente processadas exigindo intervenção manual.

Se o objetivo for apenas validar o fluxo básico, prefira o conjunto não destrutivo (cenários `consultStatus`), que não envia novas NF-e para a SEFAZ.

### Exemplo de execução destrutiva

Quando for realmente necessário autorizar uma NF-e na homologação, execute a partir da raiz do repositório, limitando o flag a este comando:

```bash
DESTRUCTIVE_TESTS=1 pnpm --filter @nfets/nfe test:integration nfe-transmitter -t 'autorizacao' '{"serie":"69","nNF":"1504","IE":"261471520","enderEmit":{"CEP":"89700903","cMun":"4204301"}}'
```

Revise cada argumento (especialmente certificado, IE e dados de endereço) antes de rodar, e lembre que toda execução deixará uma NF-e registrada no ambiente de homologação.
