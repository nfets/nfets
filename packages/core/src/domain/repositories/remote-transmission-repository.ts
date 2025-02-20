import type { Either } from 'src/shared/either';
import type { NFeTsError } from 'src/domain/errors/nfets-error';

export interface RemoteTransmissionRepository {
  send(): Promise<Either<NFeTsError, unknown>>;
  validateSchema(xml: string, xsd: string): Promise<Either<NFeTsError, void>>;
}
