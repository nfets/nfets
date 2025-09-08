import {
  IsDefined,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EnderEmit } from './ender-emit';

export class Emit {
  @IsOptional()
  @IsString()
  declare CNPJ?: string;

  @IsOptional()
  @IsString()
  declare CPF?: string;

  @IsDefined()
  @IsString()
  declare xNome: string;

  @IsOptional()
  @IsString()
  declare xFant?: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => EnderEmit)
  declare enderEmit: EnderEmit;

  @IsDefined()
  @IsString()
  declare IE: string;

  @IsOptional()
  @IsString()
  declare IEST?: string;

  @IsOptional()
  @IsString()
  declare IM?: string;

  @IsOptional()
  @IsString()
  declare CNAE?: string;

  @IsDefined()
  @IsString()
  @IsIn(['1', '2', '3', '4'])
  declare CRT: string;
}
