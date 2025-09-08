import {
  IsDefined,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Card } from './card';

export class DetPag {
  @IsOptional()
  @IsString()
  @IsIn(['0', '1'])
  declare indPag?: string;

  @IsDefined()
  @IsString()
  declare tPag: string;

  @IsDefined()
  @IsString()
  declare vPag: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Card)
  declare card?: Card;

  @IsOptional()
  @IsString()
  declare xPag?: string;
}
