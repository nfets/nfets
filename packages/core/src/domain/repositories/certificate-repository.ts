import type { KeyObject, X509Certificate } from 'node:crypto';

import type { Either } from '@nfets/core/shared/either';
import type { NFeTsError } from '@nfets/core/domain/errors/nfets-error';
import type {
  ReadCertificateRequest,
  ReadCertificateResponse,
} from '@nfets/core/domain/entities/certificate/certificate';
import type { SignatureAlgorithm } from '@nfets/core/domain/entities/signer/algo';

export interface CertificateRepository {
  read(
    request: ReadCertificateRequest,
  ): Promise<Either<NFeTsError, ReadCertificateResponse>>;
  sign(
    content: string,
    privateKey: KeyObject,
    algorithm: SignatureAlgorithm,
  ): Promise<Either<NFeTsError, string>>;
  getStringCertificate(certificate: X509Certificate): string;
  getStringPrivateKey(privateKey: KeyObject): string;
}
