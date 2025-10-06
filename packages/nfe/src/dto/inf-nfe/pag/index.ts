import {
  ArrayMaxSize,
  ArrayMinSize,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DetPag, DetPag as IDetPag } from './det-pag';
import { Pag as IPag } from 'src/entities/nfe/inf-nfe/pag';
import { TransformDecimal } from 'src/application/validator/decimal';

import type { DecimalValue } from '@nfets/core';

export class Pag implements IPag {
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @Type(() => DetPag)
  public detPag!: [IDetPag, ...IDetPag[]];

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vTroco?: DecimalValue;
}
