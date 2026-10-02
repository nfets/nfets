import 'reflect-metadata';

import { validateSync, type ValidationError } from 'class-validator';
import { SkipValidationMetadata } from './skip-validations';
import {
  clearEmptyValues,
  plainToInstance,
} from '../transformers/plain-to-instance';

export const ValidateErrorsMetadata = '__ValidateErrors__';

export const mapConstraintsToErrors = (
  errors: ValidationError[],
  parent?: string,
): string[] =>
  errors.reduce<string[]>((constraints, it) => {
    if (it.children?.length) {
      return constraints.concat(
        mapConstraintsToErrors(
          it.children,
          parent ? `${parent}.${it.property}` : it.property,
        ),
      );
    }

    const messages = Object.values(it.constraints ?? {})
      .map((it) => (parent ? `${parent}.${it}` : it))
      .join(', ');

    if (!messages) return constraints;
    return constraints.concat(messages);
  }, []);

export interface ValidatesOptions {
  each?: boolean;
}

type ValidatesPayload<T, O extends ValidatesOptions> = O extends { each: true }
  ? T[]
  : T;

export const Validates = <
  T extends object,
  const O extends ValidatesOptions = { each: false },
>(
  klass: new () => T,
  options?: O,
) => {
  return (
    _target: object,
    property: string | symbol,
    descriptor: TypedPropertyDescriptor<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (payload: ValidatesPayload<T, O>, ...args: any[]) => any
    >,
  ) => {
    const original = descriptor.value;
    if (original == null) return;

    const validate = (target: object, payload: object, path: string): T => {
      const instance = plainToInstance<T>(payload, klass);
      const errors = validateSync(instance, { whitelist: true });
      clearEmptyValues(instance);

      if (errors.length) {
        const current = (Reflect.getMetadata(ValidateErrorsMetadata, target) ??
          []) as string[];

        Reflect.defineMetadata(
          ValidateErrorsMetadata,
          current.concat(mapConstraintsToErrors(errors, path)),
          target,
        );
      }

      return instance;
    };

    descriptor.value = function (
      ...args: [ValidatesPayload<T, O> | undefined, ...object[]]
    ) {
      const skipAllValidations = Reflect.getMetadata(
        SkipValidationMetadata,
        this.constructor,
      ) as true | undefined;

      // Check if the current instance method has SkipValidation metadata
      const skipValidation = Reflect.getMetadata(
        SkipValidationMetadata,
        this.constructor.prototype as object,
        property.toString(),
      ) as true | undefined;

      if (skipValidation === true || skipAllValidations === true) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return original.apply(this, args as [ValidatesPayload<T, O>]);
      }

      const [payload, ...rest] = args;

      if (!payload)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return original.apply(this, args as [ValidatesPayload<T, O>]);

      const instance =
        options?.each && Array.isArray(payload)
          ? (payload as T[]).map((item, index) =>
              validate(this, item, `${original.name}.${index}`),
            )
          : validate(this, payload, original.name);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return original.apply(this, [
        instance as ValidatesPayload<T, O>,
        ...rest,
      ]);
    };
  };
};
