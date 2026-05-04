import fs from 'node:fs';
import path from 'node:path';
import forge from 'node-forge';

/**
 * Mesmo formato que {@link ReadCertificateRequest} em `@nfets/core` (tipo local para evitar
 * dependência cíclica `core` ↔ `@nfets/test`).
 */
export type ReadCertificateRequestForPipelineTests = {
  password: string;
  pfxPathOrBase64?: string;
  publicCertDerBase64?: string;
};

/**
 * Em `win32`, o {@link Pipeline} assina via CryptoAPI/CNG (certificado no repositório MY).
 * Para os testes alinharem a essa rotina, devolvemos o certificado público em DER (base64)
 * — a chave privada continua só na store, como no cenário real com certificado não exportável.
 * Nos demais SOs, mantém-se o PFX em memória com {@link CryptoSignerRepository}.
 */
export const readCertificateRequestForPipelineTests = (
  pfxPath: string,
  password: string,
): ReadCertificateRequestForPipelineTests => {
  if (process.platform !== 'win32') {
    return { pfxPathOrBase64: pfxPath, password };
  }

  const pfxBuffer = fs.readFileSync(pfxPath);
  const p12Asn1 = forge.asn1.fromDer(pfxBuffer.toString('binary'));
  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, password);
  const oidCertBag = forge.pki.oids.certBag;
  const certBags = p12.getBags({ bagType: oidCertBag });
  const certBag = certBags[oidCertBag];
  const cert = certBag?.[0]?.cert;
  if (!cert) {
    throw new Error(`Nenhum certificado no PFX: ${pfxPath}`);
  }

  const der = forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes();

  return {
    password,
    publicCertDerBase64: Buffer.from(der, 'binary').toString('base64'),
  };
};

export const getCnpjCertificate = () => {
  return path.resolve(
    __dirname,
    '../fixtures/certificates/certificate_79839601000142.pfx',
  );
};

export const getCpfCertificate = () => {
  return path.resolve(
    __dirname,
    '../fixtures/certificates/certificate_61094730068.pfx',
  );
};

export const getCertificatePassword = () => {
  return '123456';
};

export const getCnpjCertificateReadRequest =
  (): ReadCertificateRequestForPipelineTests => {
    return readCertificateRequestForPipelineTests(
      getCnpjCertificate(),
      getCertificatePassword(),
    );
  };
