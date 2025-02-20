import type { Either } from 'src/shared/either';
import type { NFeTsError } from '../errors/nfets-error';
import type { ReadCertificateResponse } from '../entities/certificate/certificate';

export interface CertificateRepository {
  read(
    pfxPathOrBase64: string,
    password: string,
  ): Promise<Either<NFeTsError, ReadCertificateResponse>>;
}
