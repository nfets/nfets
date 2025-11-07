---
credits: https://github.com/nfephp-org/sped-nfe/pull/1061/commits/b2fa2fd7a15acd32d8f395817f417d3e04cf7360
---

# Gerar Certificado auto assinado

> Gerar chave privada:

```bash
openssl genpkey -algorithm RSA -out ../../packages/test/fixtures/certificates/private.key -pkeyopt rsa_keygen_bits:2048
```

## Para um CNPJ

Os certificados seguem o padrão ICP-Brasil:

- `O = ICP-Brasil`
- `OU = Certificado PJ A1`
- O OID `2.16.76.1.3.3` contém o CNPJ (14 dígitos, sem formatação)

> Gere o Certificado Autoassinado (CNPJ):

```bash
openssl req -new -x509 -days 3650 -key ../../packages/test/fixtures/certificates/private.key -out certificate_79839601000142.crt -config openssl-cnpj.cnf -extensions v3_ca
```

> Converta para o formato PFX:

```bash
openssl pkcs12 -export -out certificate_79839601000142.pfx -inkey ../../packages/test/fixtures/certificates/private.key -in certificate_79839601000142.crt -certfile certificate_79839601000142.crt -passout pass:123456
```

## Para um CPF

Os certificados seguem o padrão ICP-Brasil:

- `O = ICP-Brasil`
- `OU = Certificado PF A1`
- O OID `2.16.76.1.3.1` é composto por uma data de nascimento seguido do CPF.
- Formato: `2.16.76.1.3.1 = ASN1:UTF8String:ddddddddccccccccccc`
- Onde `d` é data de nascimento (8 dígitos, formato ddmmaaaa) e `c` é o CPF (11 dígitos, somente números).

> Gere o Certificado Autoassinado (CPF):

```bash
openssl req -new -x509 -days 3650 -key ../../packages/test/fixtures/certificates/private.key -out certificate_61094730068.crt -config openssl-cpf.cnf -extensions v3_ca
```

> Converta para o formato PFX:

```bash
openssl pkcs12 -export -out certificate_61094730068.pfx -inkey ../../packages/test/fixtures/certificates/private.key -in certificate_61094730068.crt -certfile certificate_61094730068.crt -passout pass:123456
```
