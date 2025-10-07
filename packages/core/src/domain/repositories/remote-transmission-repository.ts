import type { Either } from '../../shared/either';
import type { NFeTsError } from '../../domain/errors/nfets-error';
import type { SendTransmissionPayload } from '../../domain/entities/transmission/payload';

export interface RemoteTransmissionRepository {
  send<R, M extends string>(
    params: SendTransmissionPayload<M>,
  ): Promise<Either<NFeTsError, R>>;
}
