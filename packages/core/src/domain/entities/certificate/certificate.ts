import type { KeyObject, X509Certificate } from 'node:crypto';

export interface ReadCertificateRequest {
  password: string;
  /** PKCS#12 file path, URL, or base64 payload. Omit when using {@link publicCertDerBase64}. */
  pfxPathOrBase64?: string;
  /**
   * Base64-encoded DER of the leaf certificate installed in Windows MY (non-exportable keys).
   * When set, signing on Windows uses CryptoAPI/CNG via native addon; {@link pfxPathOrBase64} must be omitted.
   */
  publicCertDerBase64?: string;
}

export interface ReadCertificateResponse {
  password: string;
  ca: X509Certificate[];
  certificate: X509Certificate;
  privateKey?: KeyObject;
}

export interface CertificateInfo {
  CNPJ?: string;
  CPF?: string;
  O?: string;
  C?: string;
  ST?: string;
  L?: string;
  CN?: string;
  OU?: string;
}
