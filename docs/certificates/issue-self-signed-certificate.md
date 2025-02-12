---
credits: https://github.com/nfephp-org/sped-nfe/pull/1061/commits/b2fa2fd7a15acd32d8f395817f417d3e04cf7360
---

# Gerar Certificado auto assinado

> Gerar chave privada:

```bash
openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048
```

## Para um CNPJ

> Gere o Certificado Autoassinado (CNPJ):

```bash
openssl req -new -x509 -days 3650 -key private.key -out certificate_79839601000142.crt -config openssl-cnpj.cnf -extensions v3_ca
```

> Converta para o formato PFX:

```bash
openssl pkcs12 -export -out certificate_79839601000142.pfx -inkey private.key -in certificate_79839601000142.crt -certfile certificate_79839601000142.crt -passout pass:123456
```

## Para um CPF

Note que o OID 2.16.76.1.3.1 é composto por uma data de nascimento seguido do CPF.
2.16.76.1.3.1 = ASN1:UTF8String:ddddddddccccccccccc
Onde d é data de nascimento e c é o cpf somente números.

> Gere o Certificado Autoassinado (CPF):

```bash
openssl req -new -x509 -days 3650 -key private.key -out certificate_61094730068.crt -config openssl-cpf.cnf -extensions v3_ca
```

> Converta para o formato PFX:

```bash
openssl pkcs12 -export -out certificate_61094730068.pfx -inkey private.key -in certificate_61094730068.crt -certfile certificate_61094730068.crt -passout pass:123456
```
