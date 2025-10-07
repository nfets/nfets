import type { Either } from '@nfets/core/shared/either';
import type { NFeTsError } from '@nfets/core/domain/errors/nfets-error';
import type {
  Certificate,
  ReadCertificateResponse,
} from '@nfets/core/domain/entities/certificate/certificate';
import type { PrivateKey } from '@nfets/core/domain/entities/certificate/private-key';
import type { SignatureAlgorithm } from '@nfets/core/domain/entities/signer/algo';

export interface CertificateRepository {
  read(
    pfxPathOrBase64: string,
    password: string,
  ): Promise<Either<NFeTsError, ReadCertificateResponse>>;
  sign(
    content: string,
    privateKey: PrivateKey,
    algorithm: SignatureAlgorithm,
  ): Promise<Either<NFeTsError, string>>;
  getStringPublicKey(certificate: Certificate): string;
  getStringPrivateKey(privateKey: PrivateKey): string;
}
