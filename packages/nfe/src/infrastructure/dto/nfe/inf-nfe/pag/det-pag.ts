import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Card, Card as ICard } from './card';
import { DetPag as IDetPag } from '@nfets/nfe/domain/entities/nfe/inf-nfe/pag';
import { TransformDecimal, TransformDateString } from '@nfets/core/application';

import type { DecimalValue } from '@nfets/core/domain';
import type { TPag } from '@nfets/nfe/domain/entities/constants/tpag';

export class DetPag implements IDetPag {
  @IsOptional()
  @IsString()
  public indPag?: string;

  @IsString()
  public tPag!: TPag;

  @IsOptional()
  @IsString()
  public xPag?: string;

  @TransformDecimal({ fixed: 2 })
  public vPag!: DecimalValue;

  @IsOptional()
  @TransformDateString({ format: 'YYYY-MM-DD' })
  public dPag?: string;

  @IsOptional()
  @IsString()
  public CNPJPag?: string;

  @IsOptional()
  @IsString()
  public UFPag?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Card)
  public card?: ICard;
}
