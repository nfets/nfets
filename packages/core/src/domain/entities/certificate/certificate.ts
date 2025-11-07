import type { KeyObject, X509Certificate } from 'node:crypto';

export interface ReadCertificateResponse {
  password: string;
  ca: X509Certificate[];
  certificate: X509Certificate;
  privateKey: KeyObject;
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
