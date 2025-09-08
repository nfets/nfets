import {
  IsDefined,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EnderDest } from './ender-dest';

export class Dest {
  @IsOptional()
  @IsString()
  declare CNPJ?: string;

  @IsOptional()
  @IsString()
  declare CPF?: string;

  @IsOptional()
  @IsString()
  declare idEstrangeiro?: string;

  @IsOptional()
  @IsString()
  declare xNome?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EnderDest)
  declare enderDest?: EnderDest;

  @IsDefined()
  @IsString()
  @IsIn(['1', '2', '9'])
  declare indIEDest: string;

  @IsOptional()
  @IsString()
  declare IE?: string;

  @IsOptional()
  @IsString()
  declare ISUF?: string;

  @IsOptional()
  @IsString()
  declare IM?: string;

  @IsOptional()
  @IsString()
  declare email?: string;
}
