import { NFeTsError } from '../domain/errors/nfets-error';
import { left } from './either';

const hasMessageInRecord = (error: unknown): error is { message: string } =>
  !!error && typeof error === 'object' && 'message' in error;

export const leftFromError = (error: unknown) => {
  if (typeof error === 'string') return left(new NFeTsError(error));
  if (error instanceof Error)
    return left(new NFeTsError(error.message, { cause: error.cause }));
  if (hasMessageInRecord(error)) return left(new NFeTsError(error.message));
  return left(new NFeTsError('unexpected error'));
};
