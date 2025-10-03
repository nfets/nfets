import { NFeTsError } from 'src/domain/errors/nfets-error';

export const unreachable = (_: never): never => {
  throw new NFeTsError(`Didn't expect to get here`);
};
