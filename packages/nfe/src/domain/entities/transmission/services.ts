import type {
  EnvironmentCode,
  StateAcronym,
  StateCode,
  StateCodes,
} from '@nfets/core';

type WebserviceForState<
  WS extends Record<string, unknown>,
  S extends StateCode,
> = S extends keyof WS ? WS[S] : never;

type UfMap = typeof StateCodes;

type StateAcronymFromCode<S extends StateCode> = {
  [K in keyof UfMap]: S extends UfMap[K] ? Extract<K, StateAcronym> : never;
}[keyof UfMap];

export interface Webservice {
  url: string;
  method: string;
  operation: string;
  version: string;
}

export type GroupServicesForState<
  WS extends Record<string, unknown>,
  O extends Record<string, unknown>,
  S extends StateCode,
  E extends EnvironmentCode,
> = WebserviceForState<WS, S> extends keyof O
  ? E extends keyof O[WebserviceForState<WS, S>]
    ? keyof O[WebserviceForState<WS, S>][E]
    : never
  : never;

export type StateServicesForState<
  O extends Record<string, unknown>,
  S extends StateCode,
  E extends EnvironmentCode,
> = StateAcronymFromCode<S> extends keyof O
  ? E extends keyof O[StateAcronymFromCode<S>]
    ? keyof O[StateAcronymFromCode<S>][E]
    : never
  : never;

type ServicesForState<
  WS extends Record<string, unknown>,
  O extends Record<string, unknown>,
  S extends StateCode,
  E extends EnvironmentCode,
> = GroupServicesForState<WS, O, S, E> | StateServicesForState<O, S, E>;

export type ServiceOptions<
  WS extends Record<string, unknown>,
  O extends Record<string, unknown>,
  S extends StateCode = StateCode,
  E extends EnvironmentCode = EnvironmentCode,
> = {
  cUF?: S;
  tpAmb?: E;
  service: ServicesForState<WS, O, S, E>;
};
