import { search } from '@nfets/core/shared/search-file';

const Schemas = {
  PL_009_V4: 'PL_009_V4',
  PL_010_V1: 'PL_010_V1',
  PL_010_V1_21: 'PL_010_V1.21',
} as const;

export const schemas = () => {
  if (process.env.NFETS_NFE_SCHEMAS_DIR) {
    return process.env.NFETS_NFE_SCHEMAS_DIR;
  }

  try {
    return search<string>('node_modules/nfets/packages/nfe/schemas', {
      onFound: (path) => path,
      onNotFound: () => {
        throw new Error('Schemas not found on node_modules/nfets/packages/nfe/schemas');
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
