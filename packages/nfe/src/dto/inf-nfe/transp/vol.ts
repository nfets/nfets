import { IsOptional, IsString } from 'class-validator';
import { IsDecimal } from 'src/application/validator/decimal';
import { Vol as IVol } from 'src/entities/nfe/inf-nfe/transp';

import type { DecimalValue } from '@nfets/core';

export class Vol implements IVol {
  @IsOptional()
  @IsString()
  public qVol?: string;

  @IsOptional()
  @IsString()
  public esp?: string;

  @IsOptional()
  @IsString()
  public marca?: string;

  @IsOptional()
  @IsString()
  public nVol?: string;

  @IsOptional()
  @IsDecimal()
  public pesoL?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pesoB?: DecimalValue;
}
