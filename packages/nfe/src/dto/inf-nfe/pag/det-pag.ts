import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Card, Card as ICard } from './card';
import { DetPag as IDetPag } from 'src/entities/nfe/inf-nfe/pag';
import { TransformDecimal } from 'src/application/validator/decimal';

import type { DecimalValue } from '@nfets/core';

export class DetPag implements IDetPag {
  @IsOptional()
  @IsString()
  public indPag?: string;

  @IsString()
  public tPag!: string;

  @TransformDecimal({ fixed: 2 })
  public vPag!: DecimalValue;

  @IsOptional()
  @ValidateNested()
  @Type(() => Card)
  public card?: ICard;

  @IsOptional()
  @IsString()
  public xPag?: string;
}
