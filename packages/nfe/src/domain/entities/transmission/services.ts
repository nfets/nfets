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

export interface Webservice<M extends string = string> {
  url: string;
  method: M;
  operation: string;
  version: string;
}

type LookupService<
  O extends Record<string, unknown>,
  Group extends string,
  E extends EnvironmentCode,
  K extends string,
> = Group extends keyof O
  ? E extends keyof O[Group]
    ? K extends keyof O[Group][E]
      ? O[Group][E][K]
      : never
    : never
  : never;

type WebserviceConfigOf<
  WS extends Record<string, unknown>,
  O extends Record<string, unknown>,
  S extends StateCode,
  E extends EnvironmentCode,
  K extends string,
> =
  | LookupService<O, WebserviceForState<WS, S> & string, E, K>
  | LookupService<O, StateAcronymFromCode<S> & string, E, K>;

type AsWebservice<C> = C extends { readonly method: infer M extends string }
  ? Webservice<M> & Omit<C, 'method'>
  : never;

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

type ServiceName<
  WS extends Record<string, unknown>,
  O extends Record<string, unknown>,
  S extends StateCode,
  E extends EnvironmentCode,
> = Extract<ServicesForState<WS, O, S, E>, string>;

export type WebserviceForService<
  WS extends Record<string, unknown>,
  O extends Record<string, unknown>,
  S extends StateCode,
  E extends EnvironmentCode,
  K extends ServiceName<WS, O, S, E>,
> = AsWebservice<WebserviceConfigOf<WS, O, S, E, K>>;

export type ServiceOptions<
  WS extends Record<string, unknown>,
  O extends Record<string, unknown>,
  S extends StateCode = StateCode,
  E extends EnvironmentCode = EnvironmentCode,
  K extends ServiceName<WS, O, S, E> = ServiceName<WS, O, S, E>,
> = {
  cUF?: S;
  tpAmb?: E;
  service: K;
};
