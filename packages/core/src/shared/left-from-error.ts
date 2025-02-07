import { NFeTsError } from 'src/domain/errors/nfets-error';
import { left } from './either';

export const leftFromError = (error: unknown) => {
  if (!(error instanceof Error))
    return left(new NFeTsError('unexpected error'));
  return left(new NFeTsError(error.message, { cause: error.cause }));
};
