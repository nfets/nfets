import type { RequestConfig } from '../../repositories/http-client';

export type Client = Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (args: any, opt?: RequestConfig) => Promise<any>
>;

export type KnownKeys<T> = keyof {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  [K in keyof T as {} extends Record<K, 1> ? never : K]: T[K];
};

export type SendTransmissionPayload<C extends Client> = {
  [M in KnownKeys<C> & string]: {
    url: string;
    method: M;
    root: string;
    xsd: string;
    payload: Parameters<C[M]>[0];
  };
}[KnownKeys<C> & string];

export type ExtractReturnType<
  C extends Client,
  P extends SendTransmissionPayload<C>,
> = P extends { method: infer M extends keyof C }
  ? Awaited<ReturnType<C[M]>>
  : never;
