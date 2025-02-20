import type { PrivateKey } from './private-key';
import type { PublicKey } from './public-key';

export type SignatureScheme = 'RSASSA-PKCS1-V1_5' | 'NONE' | null;

interface CertificateFieldOptions {
  name?: string | undefined;
  type?: string | undefined;
  shortName?: string | undefined;
}

interface CertificateField extends CertificateFieldOptions {
  valueConstructed?: boolean | undefined;
  value?: unknown[] | string | undefined;
  extensions?: unknown[] | undefined;
}

export interface Certificate {
  version: number;
  serialNumber: string;
  signatureOid: string;
  signature: string;
  siginfo: {
    algorithmOid: string;
    parameters: unknown;
  };
  validity: {
    notBefore: Date;
    notAfter: Date;
  };
  issuer: {
    attributes: CertificateField[];
    hash: string;
  };
  subject: {
    attributes: CertificateField[];
    hash: string;
  };
  extensions: unknown[];
  privateKey: PrivateKey | Buffer | Uint8Array;
  publicKey: PublicKey | Buffer | Uint8Array;
}

export interface ReadCertificateResponse {
  cert: Certificate;
  certificate: Buffer | string;
  privateKey: Buffer | string;
  ca: (Buffer | string)[];
  password?: string;
}
