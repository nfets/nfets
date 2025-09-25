import 'reflect-metadata';

export const SkipValidationMetadata = '__SkipValidation__';

export const SkipValidation = (): MethodDecorator => {
  return (target: object, property: string | symbol) => {
    Reflect.defineMetadata(
      SkipValidationMetadata,
      true,
      target,
      property.toString(),
    );
  };
};

export const SkipAllValidations = (): ClassDecorator => {
  return (target: object) => {
    Reflect.defineMetadata(SkipValidationMetadata, true, target);
  };
};
