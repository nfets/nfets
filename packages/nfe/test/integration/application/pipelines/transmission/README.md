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
DESTRUCTIVE_TESTS=1 TEST_PAYLOAD='{"serie":"69","nNF":"1504","IE":"","CNPJ":"","enderEmit":{"CEP":"","UF":"","xMun":"","cMun":""}}' pnpm --filter @nfets/nfe test:integration nfe-authorizer-pipeline.integration -t 'should authorize a nfe'
```

Quando for realmente necessário autorizar uma NF-e na contingência, execute a partir da raiz do repositório, limitando o flag a este comando:

```bash
DESTRUCTIVE_TESTS=1 TEST_PAYLOAD='{"serie":"69","nNF":"1504","IE":"","CNPJ":"","enderEmit":{"CEP":"","UF":"","xMun":"","cMun":""}}' pnpm --filter @nfets/nfe test:integration nfe-authorizer-pipeline.integration -t 'should authorize a contingency nfe'
```

Quando for realmente necessário autorizar um Lote de NFe na homolgação, execute a partir da raiz do repositório, limitando o flag a este comando:

Lembrando que o teste autoriza uma NFe com o nNF informado e outra NFe com o nNF + 1.

```bash
DESTRUCTIVE_TESTS=1 TEST_PAYLOAD='{"serie":"69","nNF":"1504","IE":"","CNPJ":"","enderEmit":{"CEP":"","UF":"","xMun":"","cMun":""}}' pnpm --filter @nfets/nfe test:integration nfe-authorizer-pipeline -t 'should authorize a batch of nfes'
```

Quando for realmente necessário consultar um recibo de Lote de NFe (retAutorizacao), execute a partir da raiz do repositório, limitando o flag a este comando:

```bash
DESTRUCTIVE_TESTS=1 TEST_PAYLOAD='{"nRec":""}' pnpm --filter @nfets/nfe test:integration nfe-authorization-response -t 'should return the authorization response of a nfe'
```

Quando for realmente necessário autorizar uma NFC-e na homologação, execute a partir da raiz do repositório, limitando o flag a este comando:

```bash
DESTRUCTIVE_TESTS=1 TEST_PAYLOAD='{"serie":"69","nNF":"1504","IE":"","enderEmit":{"CEP":"89700903","cMun":"4204301"}}' pnpm --filter @nfets/nfe test:integration nfce-transmitter -t 'autorizacao'
```

Quando for realmente necessário cancelar uma NF-e na homologação, execute a partir da raiz do repositório, limitando o flag a este comando:

```bash
DESTRUCTIVE_TESTS=1 TEST_PAYLOAD='{"chNFe":"","nProt":"","xJust":"Cancelamento de NFe em homologação"}' pnpm --filter @nfets/nfe test:integration nfe-nfce-cancel-pipeline -t 'should cancel a nfe'
```

Quando for realmente necessário inutilizar um intervalo de NF-e na homologação, execute a partir da raiz do repositório, limitando o flag a este comando:

```bash
DESTRUCTIVE_TESTS=1 TEST_PAYLOAD='{"UF":"","mod":"55","serie":"69","nNFIni":"1504","nNFFin":"1504","xJust":"Inutilização de NFe em homologação"}' pnpm --filter @nfets/nfe test:integration nfe-nfce-void-range-pipeline -t 'should void a range of nfe'
```

Revise cada argumento (especialmente certificado, IE e dados de endereço) antes de rodar, e lembre que toda execução deixará uma NF-e registrada no ambiente de homologação.
