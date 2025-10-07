import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EnderDest } from './ender-dest';

import type { Dest as IDest } from '@nfets/nfe/entities/nfe/inf-nfe/dest';
import type { EnderDest as IEnderDest } from '@nfets/nfe/entities/nfe/inf-nfe/dest';
import { Case } from '@nfets/nfe/application/validator/switch-case';

export class Dest implements IDest {
  @IsOptional()
  @IsString()
  @Case()
  public CNPJ?: string;

  @IsOptional()
  @IsString()
  @Case()
  public CPF?: string;

  @IsOptional()
  @IsString()
  public idEstrangeiro?: string;

  @IsOptional()
  @IsString()
  public xNome?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => EnderDest)
  public enderDest?: IEnderDest;

  @IsString()
  public indIEDest!: string;

  @IsOptional()
  @IsString()
  public IE?: string;

  @IsOptional()
  @IsString()
  public ISUF?: string;

  @IsOptional()
  @IsString()
  public IM?: string;

  @IsOptional()
  @IsString()
  public email?: string;
}
