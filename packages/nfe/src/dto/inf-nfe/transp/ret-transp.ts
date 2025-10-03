import { IsOptional, IsString } from 'class-validator';
import { IsDecimal } from 'src/application/validator/decimal';
import { RetTransp as IRetTransp } from 'src/entities/nfe/inf-nfe/transp';

import type { DecimalValue } from '@nfets/core';

export class RetTransp implements IRetTransp {
  @IsOptional()
  @IsDecimal()
  public vServ?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vBCRet?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public pICMSRet?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vICMSRet?: DecimalValue;

  @IsOptional()
  @IsString()
  public CFOP?: string;

  @IsOptional()
  @IsString()
  public cMunFG?: string;
}
