import 'reflect-metadata';

import { plainToInstance } from 'class-transformer';
import { validateSync, type ValidationError } from 'class-validator';
import { SkipValidationMetadata } from './skip-validations';

export const ValidateErrorsMetadata = '__ValidateErrors__';

const mapConstraintsToErrors = (
  errors: ValidationError[],
  parent?: string,
): string[] =>
  errors.reduce<string[]>((constraints, it) => {
    if (it.children?.length) {
      return constraints.concat(
        mapConstraintsToErrors(it.children, it.property),
      );
    }

    const messages = Object.values(it.constraints ?? {})
      .map((it) => (parent ? `${parent}.${it}` : it))
      .join(', ');

    if (!messages) return constraints;
    return constraints.concat(messages);
  }, []);

export const Validates = <T extends object>(klass: new () => T) => {
  return (
    target: object,
    property: string | symbol,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor: TypedPropertyDescriptor<(payload: T, ...args: object[]) => any>,
  ) => {
    const original = descriptor.value;

    descriptor.value = function (...args: [T, ...object[]]) {
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
        return original?.apply(this, args);
      }

      const [payload, ...rest] = args;
      const instance = plainToInstance(klass, payload);

      const errors = validateSync(instance, { whitelist: true });
      if (errors.length) {
        const current = (Reflect.getMetadata(
          ValidateErrorsMetadata,
          this.constructor,
        ) ?? []) as string[];
        Reflect.defineMetadata(
          ValidateErrorsMetadata,
          current.concat(mapConstraintsToErrors(errors, original?.name)),
          this.constructor,
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return original?.apply(this, [instance, ...rest]);
    };
  };
};
