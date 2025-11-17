import { Transform } from 'class-transformer';
import { IsDateString, type ValidationOptions } from 'class-validator';
import date from '../../date/date-toolkit';

export interface TransformToDateStringArgs extends ValidationOptions {
  format?: string;
}

export const TransformDateString = (args: TransformToDateStringArgs = {}) => {
  return (target: object, propertyKey: string | symbol) => {
    Transform(({ value }: { value?: Date | string }) => {
      const parsed = value instanceof Date ? value.toISOString() : value;
      // TODO: find a way to get the context from the validator to fill timezone for each state code
      return parsed
        ? date(parsed).tz('America/Sao_Paulo').format(args.format)
        : void 0;
    })(target, propertyKey);
    IsDateString()(target, propertyKey);
  };
};
