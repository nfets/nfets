import type { KeyObject, X509Certificate } from 'node:crypto';

export interface ReadCertificateResponse {
  password: string;
  ca: X509Certificate[];
  certificate: X509Certificate;
  privateKey: KeyObject;
}
