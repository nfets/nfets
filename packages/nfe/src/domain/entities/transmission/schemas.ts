import { getCurrentFile } from '@nfets/core/shared/resolve-requires';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const Schemas = {
  PL_009_V4: 'PL_009_V4',
  PL_010_V1: 'PL_010_V1',
  PL_010_V1_21: 'PL_010_V1.21',
} as const;

export const schemas = () => {
  if (process.env.NFETS_NFE_SCHEMAS_DIR) {
    return process.env.NFETS_NFE_SCHEMAS_DIR;
  }

  const __filename = getCurrentFile();

  const attempts = [
    resolve(__filename, 'node_modules', 'nfets', 'packages', 'nfe', 'schemas'),
    resolve(__filename, '../../../../', 'nfe', 'schemas'),
    resolve(__filename, '../../../', 'nfe', 'schemas'),
    resolve(__filename, '../../', 'nfe', 'schemas'),
    resolve(__filename, '../', 'nfe', 'schemas'),
  ];

  for (const attempt of attempts) {
    if (existsSync(attempt)) return attempt;
  }

  return __filename;
};

export type Schema = (typeof Schemas)[keyof typeof Schemas];
export default Schemas;
