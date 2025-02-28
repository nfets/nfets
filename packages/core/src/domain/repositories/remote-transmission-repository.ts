import type { Either } from 'src/shared/either';
import type { NFeTsError } from 'src/domain/errors/nfets-error';
import type { SendTransmissionPayload } from '../entities/transmission/payload';

export interface RemoteTransmissionRepository {
  send<R, M extends string>(
    params: SendTransmissionPayload<M>,
  ): Promise<Either<NFeTsError, R>>;
}
