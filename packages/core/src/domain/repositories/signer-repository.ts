import type { ReadCertificateResponse } from '../entities/certificate/certificate';
import type { SignatureAlgorithm } from '../entities/signer/algo';
import type { Signature } from '../entities/signer/signature';
import type { Either } from '../../shared/either';
import type { NFeTsError } from '../errors/nfets-error';

export interface SignerOptions<T = string> {
  tag: T;
  mark: string;
}

export type SignedEntity<T extends object> = T & {
  Signature: Signature;
};

export interface SignerRepository {
  sign(
    content: string,
    cert: ReadCertificateResponse,
    algorithm: SignatureAlgorithm,
  ): Promise<Either<NFeTsError, string>>;
}
