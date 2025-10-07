import { IsOptional, IsString } from 'class-validator';
import { TransformDecimal } from '@nfets/nfe/application/transform/decimal';
import { RetTransp as IRetTransp } from '@nfets/nfe/entities/nfe/inf-nfe/transp';

import type { DecimalValue } from '@nfets/core';

export class RetTransp implements IRetTransp {
  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vServ?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBCRet?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pICMSRet?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vICMSRet?: DecimalValue;

  @IsOptional()
  @IsString()
  public CFOP?: string;

  @IsOptional()
  @IsString()
  public cMunFG?: string;
}
