const schemas = {
  PL_009_V4: 'PL_009_V4',
  PL_010_V1: 'PL_010_V1',
  PL_010_V1_21: 'PL_010_V1.21',
} as const;

export type Schema = (typeof schemas)[keyof typeof schemas];
export default schemas;
