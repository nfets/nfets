# Risks of destructive integration tests

Running the scenarios under the `describe('soap nfe remote transmission (integration) (destructive)')` block in `nfe-transmitter.integration.spec.ts` will talk to the real SEFAZ homologation endpoints, issue a fully signed NF-e, and wait for authorization. Executing it without care can lead to:

- **Unintended NF-e authorization requests**: Every run sends a real XML payload signed with your certificate. Misconfigured emit/dest data or repeated runs can clutter the SEFAZ queue or expose your company's data.
- **Certificate usage and rate limits**: The certificate provided via environment variables is used to sign each request. Wrong passwords, expired certificates, or multiple parallel runs can lock the certificate or hit SEFAZ throttling.
- **Irreversible operations**: Once SEFAZ authorizes an NF-e, that document exists. Even though the fixtures produce low-value invoices, you may need to issue inutilização or cancellation procedures manually to clean up.
- **Sensitive data exposure**: The default fixtures pull emit information from the certificate (issuer name, CNPJ/CPF, address). Running with a developer certificate leaks that data to logs and telemetry.

Before running any command with the `DESTRUCTIVE_TESTS=1` flag, ensure you:

1. Understand the NF-e lifecycle for issued documents.
2. Have explicit approval to use the configured certificate in homologation.
3. Isolate secrets so they do not leak into logs or CI artifacts.
4. Monitor SEFAZ responses; a failure may leave partially processed invoices requiring manual follow-up.

If you only need to validate the happy-path flow, prefer running the non-destructive suite (the `consultStatus` scenarios) which does not push new NF-e documents to SEFAZ.

## Example destructive run

When you intentionally need to authorize an NF-e in the homologation environment, run from the repository root with the flag scoped to that single command:

```bash
DESTRUCTIVE_TESTS=1 pnpm --filter @nfets/nfe test:integration nfe-authorizer-pipeline.integration -t 'should authorize a nfe' '{"serie":"69","nNF":"1504","IE":"","CNPJ":"","enderEmit":{"CEP":"","UF":"","xMun":"","cMun":""}}'
```

When you intentionally need to authorize an NF-e in the contingency environment, run from the repository root with the flag scoped to that single command:

```bash
DESTRUCTIVE_TESTS=1 pnpm --filter @nfets/nfe test:integration nfe-authorizer-pipeline.integration -t 'should authorize a contingency nfe' '{"serie":"69","nNF":"1504","IE":"","CNPJ":"","enderEmit":{"CEP":"","UF":"","xMun":"","cMun":""}}'
```

When you intentionally need to authorize an NFC-e in the homologation environment, run from the repository root with the flag scoped to that single command:

```bash
DESTRUCTIVE_TESTS=1 pnpm --filter @nfets/nfe test:integration nfce-transmitter -t 'autorizacao' '{"serie":"69","nNF":"1504","IE":"261471520","enderEmit":{"CEP":"89700903","cMun":"4204301"}}'
```

Double-check every argument (especially the certificate, IE, and address data) before executing, and remember that each run will leave a real NF-e in the homologation environment.
