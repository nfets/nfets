import {
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Ide } from './ide';
import { Type } from 'class-transformer';

export class InfNFeAttributes {
  @IsOptional()
  @IsString()
  declare Id?: string;

  @IsOptional()
  @IsString()
  declare pk_nItem?: string;

  @IsOptional()
  @IsString()
  declare versao?: string;
}

export class InfNFe {
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => InfNFeAttributes)
  declare $: InfNFeAttributes;

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Ide)
  declare ide: Ide;
}
