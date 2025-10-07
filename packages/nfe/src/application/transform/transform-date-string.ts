import { Transform } from 'class-transformer';
import { type ValidationOptions } from 'class-validator';
import dayjs from 'dayjs';

export interface TransformToDateStringArgs extends ValidationOptions {
  format?: string;
}

export const TransformDateString = (args: TransformToDateStringArgs = {}) => {
  return (target: object, propertyKey: string | symbol) => {
    Transform(({ value }: { value?: Date }) =>
      value ? dayjs(value).format(args.format) : undefined,
    )(target, propertyKey);
  };
};
