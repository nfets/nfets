import type { KeyObject } from 'node:crypto';

export interface CertificateFieldOptions {
  name?: string | undefined;
  type?: string | undefined;
  shortName?: string | undefined;
}

interface CertificateField extends CertificateFieldOptions {
  valueConstructed?: boolean | undefined;
  value?: unknown[] | string | undefined;
  extensions?: unknown[] | undefined;
}

export interface CertificateInfo {
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
}

export interface ReadCertificateResponse {
  password: string;
  ca: KeyObject[];
  certificateInfo: CertificateInfo;
  certificate: KeyObject;
  privateKey: KeyObject;
}
