export const Once = () => {
  return (
    _target: object,
    _property: string | symbol,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor: TypedPropertyDescriptor<(...args: any[]) => any>,
  ) => {
    const original = descriptor.value;
    if (original == null) return;

    const state = new WeakMap<object, { called: true; result: unknown }>();

    descriptor.value = function (this: object, ...args: unknown[]) {
      const current = state.get(this);
      if (current?.called) return current.result;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = original.apply(this, args);
      state.set(this, { called: true, result });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return result;
    };
  };
};
