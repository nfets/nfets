export const Environment = {
  Production: '1',
  Homolog: '2',
} as const;

export type EnvironmentCode = (typeof Environment)[keyof typeof Environment];
