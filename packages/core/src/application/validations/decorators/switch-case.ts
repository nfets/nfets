import 'reflect-metadata';

import {
  registerDecorator,
  type ValidationOptions,
  type ValidationArguments,
} from 'class-validator';

export interface SwitchCaseOptions extends ValidationOptions {
  allow?: string[];
}

export const SwitchCase = ({
  allow,
  ...validationOptions
}: SwitchCaseOptions = {}): PropertyDecorator => {
  return (target: object, propertyKey: string | symbol) => {
    const key = target.constructor.name;

    registerDecorator({
      name: 'switchCase',
      target: target.constructor,
      propertyName: propertyKey as string,
      options: validationOptions,
      validator: {
        validate(_: unknown, args: ValidationArguments) {
          const instance = args.object;
          const alreadySettedOption = Reflect.getMetadata(key, instance) as
            | string
            | undefined;

          if (allow?.includes(alreadySettedOption ?? '')) return true;
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
