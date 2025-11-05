import { Decimal } from '@nfets/core/infrastructure';
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

const transformInstances = (instance: object): void => {
  for (const [key, value] of Object.entries(instance)) {
    if (value instanceof Decimal) {
      Object.defineProperty(instance, key, { value: value.toString() });
    }
    if (Array.isArray(value)) value.forEach(transformInstances);
    if (typeof value === 'object') transformInstances(value as object);
  }
};

export const plainToInstance = <T extends object>(
  payload: object,
  klass: new () => T,
): T => {
  transformInstances(payload);
  const instance = _plainToInstance(klass, payload);
  return clearUndefinedValues(instance), instance;
};
