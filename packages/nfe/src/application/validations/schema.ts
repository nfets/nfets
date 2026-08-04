import { DefaultSchema, type Schema as ISchema } from '@nfets/nfe/domain';

interface WithSchema {
  readonly schema: ISchema;
}

export const SchemaValidates = (
  schemas: readonly ISchema[] = [DefaultSchema],
) => {
  return (
    _target: object,
    _property: string | symbol,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor: TypedPropertyDescriptor<
      (this: WithSchema, ...args: any[]) => any
    >,
  ) => {
    const original = descriptor.value;
    if (original == null) return;

    descriptor.value = function (this: WithSchema, ...args: unknown[]) {
      if (!schemas.includes(this.schema)) return this;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return original.apply(this, args);
    };
  };
};
