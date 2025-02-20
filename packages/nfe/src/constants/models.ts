const models = {
  NFe: '55',
  NFCe: '65',
} as const;

export type Model = (typeof models)[keyof typeof models];

export default models;
