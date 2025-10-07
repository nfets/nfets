import { IsDate, IsOptional, IsString } from 'class-validator';
import { TransformDecimal } from '@nfets/nfe/application/transform/decimal';

import type { Avulsa as IAvulsa } from '@nfets/nfe/entities/nfe/inf-nfe/avulsa';
import type { DecimalValue } from '@nfets/core';

import { TransformDateString } from '@nfets/nfe/application/transform/transform-date-string';

export class Avulsa implements IAvulsa {
  @IsString()
  public CNPJ!: string;

  @IsString()
  public xOrgao!: string;

  @IsString()
  public matr!: string;

  @IsString()
  public xAgente!: string;

  @IsOptional()
  @IsString()
  public fone?: string;

  @IsString()
  public UF!: string;

  @IsOptional()
  @IsString()
  public nDAR?: string;

  @IsOptional()
  @TransformDateString({ format: 'YYYY-MM-DD' })
  public dEmi?: Date;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vDAR?: DecimalValue;

  @IsString()
  public repEmi!: string;

  @IsOptional()
  @IsDate()
  public dPag?: Date;
}
