export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<NonNullable<T[P]>> }
  : T;

export type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;
