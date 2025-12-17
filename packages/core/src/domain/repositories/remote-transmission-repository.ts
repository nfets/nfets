import type { Either } from '../../shared/either';
import type { NFeTsError } from '../../domain/errors/nfets-error';
import type {
  Client,
  SendTransmissionPayload,
  ExtractReturnType,
} from '../../domain/entities/transmission/payload';

import type { ReadCertificateResponse } from '../../domain/entities/certificate/certificate';

export interface RemoteTransmissionRepository<C extends Client> {
  setCertificate(
    certificate: ReadCertificateResponse,
  ): RemoteTransmissionRepository<C>;
  send<P extends SendTransmissionPayload<C>, R extends ExtractReturnType<C, P>>(
    params: P,
  ): Promise<Either<NFeTsError, R>>;
}
