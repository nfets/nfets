import { /*ArrayMaxSize, */ IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DetPag, DetPag as IDetPag } from './det-pag';
import { Pag as IPag } from 'src/entities/nfe/inf-nfe/pag';
import { IsDecimal } from 'src/application/validator/decimal';

import type { DecimalValue } from '@nfets/core';

export class Pag implements IPag {
  @ValidateNested({ each: true })
  // @ArrayMaxSize(100)
  @Type(() => DetPag)
  public detPag!: IDetPag[];

  @IsOptional()
  @IsDecimal()
  public vTroco?: DecimalValue;
}
