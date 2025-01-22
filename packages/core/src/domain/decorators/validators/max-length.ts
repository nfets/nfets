import { ValidationError } from 'src/domain/errors/validation-error';
import { isString } from 'src/domain/guards/is-string';

export const MaxLength =
  (length: number): PropertyDecorator =>
  (target, property) => {
    let internal: string | undefined;
    return Object.defineProperty(target, property, {
      get: () => internal,
      set: (value: unknown) => {
        if (!isString(value) || value.length > length)
          throw new ValidationError(
            `ValidationError: The length of the "${property.toString()}" property exceeds ${length} characters`,
          );
        internal = value;
      },
    });
  };
