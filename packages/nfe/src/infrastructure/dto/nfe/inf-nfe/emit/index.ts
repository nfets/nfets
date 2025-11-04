import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Choice } from '@nfets/core/application';
import { Type } from 'class-transformer';
import { EnderEmit } from './ender-emit';

import type { Emit as IEmit } from '@nfets/nfe/domain/entities/nfe/inf-nfe/emit';

@Choice({ properties: ['CNPJ', 'CPF'], required: true })
export class Emit implements IEmit {
  @IsOptional()
  @IsString()
  public CNPJ?: string;

  @IsOptional()
  @IsString()
  public CPF?: string;

  @IsString()
  public xNome!: string;

  @IsOptional()
  @IsString()
  public xFant?: string;

  @ValidateNested()
  @Type(() => EnderEmit)
  public enderEmit!: EnderEmit;

  @IsString()
  public IE!: string;

  @IsOptional()
  @IsString()
  public IEST?: string;

  @IsOptional()
  @IsString()
  public IM?: string;

  @IsOptional()
  @IsString()
  public CNAE?: string;

  @IsString()
  public CRT!: string;
}
