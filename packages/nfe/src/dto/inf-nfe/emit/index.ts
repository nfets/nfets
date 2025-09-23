import {
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EnderEmit } from './ender-emit';

import type { Emit as IEmit } from 'src/entities/nfe/inf-nfe/emit';

export class Emit implements IEmit {
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
  declare CRT: string;
}
