import 'reflect-metadata';

import {
  registerDecorator,
  type ValidationOptions,
  type ValidationArguments,
} from 'class-validator';

export interface SwitchCaseOptions extends ValidationOptions {
  allow?: string[];
  throwIfEmpty?: boolean;
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
        validate(value: unknown, args: ValidationArguments) {
          const instance = args.object;
          const propertyName = args.property;

          const isEmpty = value === undefined || value === null;

          console.log({ propertyKey }, validationOptions.throwIfEmpty);
          if (isEmpty && validationOptions.throwIfEmpty) return false;
          if (isEmpty) return true;

          const alreadySettedOption = Reflect.getMetadata(key, instance) as
            | string
            | undefined;

          if (allow?.includes(alreadySettedOption ?? '')) return true;
          if (alreadySettedOption && alreadySettedOption !== propertyName) {
            return false;
          }

          Reflect.defineMetadata(key, propertyKey as string, instance);
          return true;
        },
        defaultMessage(args: ValidationArguments) {
          const current = Reflect.getMetadata(key, args.object) as string;
          if (validationOptions.throwIfEmpty && !current)
            return `You must provide a value for any of the cases.`;
          return `${args.property} cannot be set because ${current} is already setted. Only one ${args.targetName} type is allowed in this group.`;
        },
      },
    });
  };
};
