import { IsOptional } from 'class-validator';
import { IsDecimal } from 'src/application/validator/decimal';
import { RetTrib as IRetTrib } from 'src/entities/nfe/inf-nfe/total';

import type { DecimalValue } from '@nfets/core';

export class RetTrib implements IRetTrib {
  @IsOptional()
  @IsDecimal()
  public vRetPIS?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vRetCOFINS?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vRetCSLL?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vBCIRRF?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vIRRF?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vBCRetPrev?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vRetPrev?: DecimalValue;
}
