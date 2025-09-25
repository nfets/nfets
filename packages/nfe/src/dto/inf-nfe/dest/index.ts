import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EnderDest } from './ender-dest';

import type { Dest as IDest } from 'src/entities/nfe/inf-nfe/dest';
import type { EnderDest as IEnderDest } from 'src/entities/nfe/inf-nfe/dest';

export class Dest implements IDest {
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
  declare enderDest?: IEnderDest;

  @IsString()
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
