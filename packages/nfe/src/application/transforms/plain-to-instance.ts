import { plainToInstance as _plainToInstance } from 'class-transformer';

const clearUndefinedValues = (instance: object): void => {
  for (const [key, value] of Object.entries(instance)) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    if (typeof value === 'undefined') delete instance[key as keyof object];
    if (value && typeof value === 'object') {
      clearUndefinedValues(value as object);
    }
  }
};

export const plainToInstance = <T extends object>(
  payload: object,
  klass: new () => T,
): T => {
  const instance = _plainToInstance(klass, payload);
  return clearUndefinedValues(instance), instance;
};
