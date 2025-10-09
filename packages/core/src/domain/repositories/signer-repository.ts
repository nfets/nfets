import type { Either } from '@nfets/core/shared/either';
import type { NFeTsError } from '../errors/nfets-error';
import type { ReadCertificateResponse } from '../entities/certificate/certificate';

export interface SignerRepository {
  sign(
    xml: string,
    tag: string,
    mark: string,
    cert: ReadCertificateResponse,
  ): Promise<Either<NFeTsError, string>>;
}
