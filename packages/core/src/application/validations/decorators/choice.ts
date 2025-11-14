import 'reflect-metadata';

import {
  registerDecorator,
  type ValidationOptions,
  type ValidationArguments,
} from 'class-validator';

interface ChoiceGroup<P extends string | number | symbol> {
  properties: [P, ...P[]];
  required?: boolean;
}

export interface ChoiceOptions<P extends string | number | symbol>
  extends ValidationOptions,
    ChoiceGroup<P> {}

const CHOICE_METADATA_KEY = Symbol('choice');

const isEmpty = (value: unknown): value is undefined =>
  value === undefined || value === null || value === '';

export const Choice = <T extends object>(
  options: ChoiceOptions<keyof T>,
): ClassDecorator => {
  return (target) => {
    type Group = ChoiceGroup<keyof T>;
    const { properties, required = false, ...validationOptions } = options;

    const existingGroups =
      (Reflect.getMetadata(CHOICE_METADATA_KEY, target) as
        | Group[]
        | undefined) ?? [];

    const newGroup = { properties, required };
    existingGroups.push(newGroup);

    Reflect.defineMetadata(CHOICE_METADATA_KEY, existingGroups, target);

    for (const propertyName of properties) {
      registerDecorator({
        name: 'choice',
        target: target,
        propertyName: propertyName as string,
        options: validationOptions,
        validator: {
          validate(value: unknown, args: ValidationArguments) {
            const instance = args.object as Record<keyof T, unknown>;
            const propertyName = args.property as keyof T;
            const allGroups = Reflect.getMetadata(
              CHOICE_METADATA_KEY,
              target,
            ) as Group[] | undefined;

            if (!allGroups) return true;

            const group = allGroups.find((g) =>
              g.properties.includes(propertyName),
            );

            if (!group) return true;
            if (isEmpty(value)) return true;

            for (const otherProperty of group.properties) {
              if (otherProperty === propertyName) continue;

              const otherValue = instance[otherProperty];
              if (!isEmpty(otherValue)) return false;
            }

            for (const otherGroup of allGroups) {
              if (otherGroup === group) continue;

              for (const otherGroupProperty of otherGroup.properties) {
                const otherGroupValue = instance[otherGroupProperty];
                if (!isEmpty(otherGroupValue)) return false;
              }
            }

            return true;
          },
          defaultMessage(args: ValidationArguments) {
            const allGroups = Reflect.getMetadata(
              CHOICE_METADATA_KEY,
              target,
            ) as Group[] | undefined;

            if (!allGroups) return `${args.property} validation error`;

            const group = allGroups.find((g) =>
              g.properties.includes(args.property as keyof T),
            );

            if (!group) return `${args.property} validation error`;

            const instance = args.object as Record<keyof T, unknown>;

            for (const prop of group.properties) {
              const value = instance[prop];
              if (!isEmpty(value) && prop !== args.property) {
                return `${args.property} cannot be set because ${
                  prop as string
                } is already set. Only one property from this choice group is allowed.`;
              }
            }

            for (const otherGroup of allGroups) {
              if (otherGroup === group) continue;

              for (const otherProp of otherGroup.properties) {
                const otherValue = instance[otherProp];
                if (!isEmpty(otherValue)) {
                  return `${args.property} cannot be set because ${
                    otherProp as string
                  } from a different choice group is already set.`;
                }
              }
            }

            return `${args.property} validation error`;
          },
        },
      });
    }

    if (required) {
      for (const propertyName of properties) {
        registerDecorator({
          name: 'choiceGroupRequired',
          target: target,
          propertyName: propertyName as string,
          options: {
            ...validationOptions,
            always: true,
          },
          validator: {
            validate(_, args: ValidationArguments) {
              const instance = args.object as Record<keyof T, unknown>;
              const allGroups = Reflect.getMetadata(
                CHOICE_METADATA_KEY,
                target,
              ) as Group[] | undefined;

              if (!allGroups) return true;
              const currentGroup = allGroups.find((g) =>
                g.properties.includes(args.property as keyof T),
              );

              if (!currentGroup?.required) return true;

              for (const prop of currentGroup.properties) {
                const propValue = instance[prop];
                if (!isEmpty(propValue)) return true;
              }

              return args.property !== currentGroup.properties[0];
            },
            defaultMessage(_args: ValidationArguments) {
              const allGroups = Reflect.getMetadata(
                CHOICE_METADATA_KEY,
                target,
              ) as Group[] | undefined;

              if (!allGroups) {
                return 'At least one property from a choice group must be provided';
              }

              const group = allGroups.find((g) =>
                g.properties.includes(_args.property as keyof T),
              );

              if (!group) {
                return 'At least one property from a choice group must be provided';
              }

              return `You must provide a value for one of the following properties: ${group.properties.join(
                ', ',
              )}`;
            },
          },
        });
      }
    }
  };
};
