import type { Either } from 'src/shared/either';
import type { NFeTsError } from '../errors/nfets-error';
import type {
  Certificate,
  ReadCertificateResponse,
} from '../entities/certificate/certificate';
import type { PrivateKey } from '../entities/certificate/private-key';
import type { SignatureAlgorithm } from '../entities/signer/algo';

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
