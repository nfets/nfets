const versions = {
  v1_00: '1.00',
  v4_00: '4.00',
} as const;

export type Version = (typeof versions)[keyof typeof versions];

export default versions;
