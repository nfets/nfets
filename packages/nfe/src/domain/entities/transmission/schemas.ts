import { search } from '@nfets/core/shared/search-file';

const Schemas = {
  PL_009_V4: 'PL_009_V4',
  PL_010_V1: 'PL_010_V1',
  PL_010_V1_21: 'PL_010_V1.21',
  PL_010_V1_30: 'PL_010_V1.30',
} as const;

export const PL_009 = [
  Schemas.PL_009_V4,
] as const satisfies (typeof Schemas)[keyof typeof Schemas][];

export const PL_010 = [
  Schemas.PL_010_V1,
  Schemas.PL_010_V1_21,
  Schemas.PL_010_V1_30,
] as const satisfies (typeof Schemas)[keyof typeof Schemas][];

export const DefaultSchema = Schemas.PL_009_V4;

export const schemas = () => {
  if (process.env.NFETS_NFE_SCHEMAS_DIR) {
    return process.env.NFETS_NFE_SCHEMAS_DIR;
  }

  try {
    return search<string>('packages/nfe/schemas', {
      onFound: (path) => path,
      onNotFound: () => {
        throw new Error('Schemas not found on packages/nfe/schemas');
      },
    });
  } catch {
    return search<string>('nfe/schemas', {
      onFound: (path) => path,
      onNotFound: () => {
        throw new Error('Schemas not found on nfe/schemas');
      },
    });
  }
};

export type Schema = (typeof Schemas)[keyof typeof Schemas];
export default Schemas;
