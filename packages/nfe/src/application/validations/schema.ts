import 'reflect-metadata';

import { DefaultSchema, type Schema as ISchema } from '@nfets/nfe/domain';

export const SchemaValidates = <S extends ISchema[] = [typeof DefaultSchema]>(
  schemas: S = [DefaultSchema] as S,
) => {
  return (
    _target: object,
    _property: string | symbol,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _descriptor: TypedPropertyDescriptor<(...args: any[]) => any>,
  ) => {
    void schemas;
  };
};
