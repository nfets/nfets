import type { SignatureAlgorithm } from '../signer/algo';
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
  publicKey: PublicKey;
}

interface ByteStringBuffer {
  data: string;
  read: number;
  toString(): string;
}

export interface MessageDigest {
  readonly algorithm: SignatureAlgorithm;
  readonly blockLength: number;
  readonly digestLength: number;
  messageLength: number;
  fullMessageLength: number[] | null;
  readonly messageLengthSize: number;
  update(msg: string, encoding?: 'raw' | 'utf8'): this;
  digest(): ByteStringBuffer;
}

export interface ReadCertificateResponse {
  password: string;
  certificate: Certificate;
  privateKey: PrivateKey;
  ca: (Buffer | string)[];
}
