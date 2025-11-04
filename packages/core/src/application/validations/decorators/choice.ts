import 'reflect-metadata';

import {
  registerDecorator,
  type ValidationOptions,
  type ValidationArguments,
} from 'class-validator';

interface ChoiceGroup {
  properties: [string, ...string[]];
  required?: boolean;
}

export interface ChoiceOptions extends ValidationOptions, ChoiceGroup {}

const CHOICE_METADATA_KEY = Symbol('choice');

export const Choice = (options: ChoiceOptions): ClassDecorator => {
  return (target) => {
    const { properties, required = false, ...validationOptions } = options;

    const existingGroups =
      (Reflect.getMetadata(CHOICE_METADATA_KEY, target) as
        | ChoiceGroup[]
        | undefined) ?? [];

    const newGroup = { properties, required };
    existingGroups.push(newGroup);

    Reflect.defineMetadata(CHOICE_METADATA_KEY, existingGroups, target);

    for (const propertyName of properties) {
      registerDecorator({
        name: 'choice',
        target: target,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: unknown, args: ValidationArguments) {
            const instance = args.object;
            const propertyName = args.property;
            const allGroups = Reflect.getMetadata(
              CHOICE_METADATA_KEY,
              target,
            ) as ChoiceGroup[] | undefined;

            if (!allGroups) return true;

            const group = allGroups.find((g) =>
              g.properties.includes(propertyName),
            );

            if (!group) return true;

            const isEmpty = value === undefined || value === null;
            if (isEmpty) return true;

            for (const otherProperty of group.properties) {
              if (otherProperty === propertyName) continue;

              const otherValue = (instance as Record<string, unknown>)[
                otherProperty
              ];

              const otherIsEmpty =
                otherValue === undefined || otherValue === null;

              if (!otherIsEmpty) return false;
            }

            for (const otherGroup of allGroups) {
              if (otherGroup === group) continue;

              for (const otherGroupProperty of otherGroup.properties) {
                const otherGroupValue = (instance as Record<string, unknown>)[
                  otherGroupProperty
                ];

                const otherGroupIsEmpty =
                  otherGroupValue === undefined || otherGroupValue === null;

                if (!otherGroupIsEmpty) return false;
              }
            }

            return true;
          },
          defaultMessage(args: ValidationArguments) {
            const allGroups = Reflect.getMetadata(
              CHOICE_METADATA_KEY,
              target,
            ) as ChoiceGroup[] | undefined;

            if (!allGroups) return `${args.property} validation error`;

            const group = allGroups.find((g) =>
              g.properties.includes(args.property),
            );

            if (!group) return `${args.property} validation error`;

            const instance = args.object as Record<string, unknown>;

            for (const prop of group.properties) {
              const value = instance[prop];
              if (!!value && prop !== args.property) {
                return `${args.property} cannot be set because ${prop} is already set. Only one property from this choice group is allowed.`;
              }
            }

            for (const otherGroup of allGroups) {
              if (otherGroup === group) continue;

              for (const otherProp of otherGroup.properties) {
                const otherValue = instance[otherProp];
                if (otherValue !== undefined && otherValue !== null) {
                  return `${args.property} cannot be set because ${otherProp} from a different choice group is already set.`;
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
          propertyName: propertyName,
          options: {
            ...validationOptions,
            always: true,
          },
          validator: {
            validate(_, args: ValidationArguments) {
              const instance = args.object as Record<string, unknown>;
              const allGroups = Reflect.getMetadata(
                CHOICE_METADATA_KEY,
                target,
              ) as ChoiceGroup[] | undefined;

              if (!allGroups) return true;

              const currentGroup = allGroups.find((g) =>
                g.properties.includes(args.property),
              );

              if (!currentGroup?.required) return true;

              for (const prop of currentGroup.properties) {
                const propValue = instance[prop];
                if (propValue !== undefined && propValue !== null) return true;
              }

              return args.property !== currentGroup.properties[0];
            },
            defaultMessage(_args: ValidationArguments) {
              const allGroups = Reflect.getMetadata(
                CHOICE_METADATA_KEY,
                target,
              ) as ChoiceGroup[] | undefined;

              if (!allGroups) {
                return 'At least one property from a choice group must be provided';
              }

              const group = allGroups.find((g) =>
                g.properties.includes(_args.property),
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
