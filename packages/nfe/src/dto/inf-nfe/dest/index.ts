import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EnderDest } from './ender-dest';

import type { Dest as IDest } from '@nfets/nfe/entities/nfe/inf-nfe/dest';
import type { EnderDest as IEnderDest } from '@nfets/nfe/entities/nfe/inf-nfe/dest';
import { SwitchCase } from '@nfets/core/application';

export class Dest implements IDest {
  @IsOptional()
  @IsString()
  @SwitchCase()
  public CNPJ?: string;

  @IsOptional()
  @IsString()
  @SwitchCase()
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
