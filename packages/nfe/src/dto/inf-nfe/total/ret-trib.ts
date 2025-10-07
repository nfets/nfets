import { IsOptional } from 'class-validator';
import { TransformDecimal } from '@nfets/nfe/application/transform/decimal';
import { RetTrib as IRetTrib } from '@nfets/nfe/entities/nfe/inf-nfe/total';

import type { DecimalValue } from '@nfets/core';

export class RetTrib implements IRetTrib {
  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vRetPIS?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vRetCOFINS?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vRetCSLL?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBCIRRF?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vIRRF?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vBCRetPrev?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vRetPrev?: DecimalValue;
}
