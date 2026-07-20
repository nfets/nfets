import type { ISTot as IISTot } from '@nfets/nfe/domain/entities/nfe/inf-nfe/total';
import { TransformDecimal } from '@nfets/core';
import type { DecimalValue } from '@nfets/core/domain';
import { IsOptional } from 'class-validator';

export class ISTot implements IISTot {
  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vIS: DecimalValue = '0.00';
}
