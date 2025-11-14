import { plainToInstance as _plainToInstance } from 'class-transformer';

export const clearEmptyValues = (instance: object): void => {
  for (const [key, value] of Object.entries(instance)) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    if (typeof value === 'undefined') delete instance[key as keyof object];
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    if (value === '') delete instance[key as keyof object];
    if (value && typeof value === 'object') {
      clearEmptyValues(value as object);
    }
  }
};

export const plainToInstance = <T extends object>(
  payload: object,
  klass: new () => T,
  options: { clearEmptyValues?: boolean } = {},
): T => {
  const instance = _plainToInstance(klass, payload);
  if (options.clearEmptyValues) clearEmptyValues(instance);
  return instance;
};
