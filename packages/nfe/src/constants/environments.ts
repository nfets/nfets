const environments = {
  homolog: '2',
  production: '1',
} as const;

export type Environment = (typeof environments)[keyof typeof environments];

export default environments;
