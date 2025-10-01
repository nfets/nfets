import 'reflect-metadata';

import {
  registerDecorator,
  type ValidationOptions,
  type ValidationArguments,
} from 'class-validator';

export const Case = (
  validationOptions?: ValidationOptions & { group: string },
): PropertyDecorator => {
  return (target: object, propertyKey: string | symbol) => {
    const key = `${validationOptions?.group ?? 'default'}.${
      target.constructor.name
    }`;

    registerDecorator({
      name: 'case',
      target: target.constructor,
      propertyName: propertyKey as string,
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const instance = args.object;
          const alreadySettedOption = Reflect.getMetadata(key, instance) as
            | string
            | undefined;

          if (alreadySettedOption) return false;

          Reflect.defineMetadata(key, propertyKey as string, instance);
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const current = Reflect.getMetadata(key, args.object) as string;
          return `${args.property} cannot be set because ${current} is already setted. Only one ${args.targetName} type is allowed in this group.`;
        },
      },
    });
  };
};
