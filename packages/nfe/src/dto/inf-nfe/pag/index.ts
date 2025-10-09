import {
  ArrayMaxSize,
  ArrayMinSize,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DetPag, DetPag as IDetPag } from './det-pag';
import { Pag as IPag } from '@nfets/nfe/entities/nfe/inf-nfe/pag';
import { TransformDecimal } from '@nfets/core/application';

import type { DecimalValue } from '@nfets/core/domain';

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
