import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Card, Card as ICard } from './card';
import { DetPag as IDetPag } from 'src/entities/nfe/inf-nfe/pag';

export class DetPag implements IDetPag {
  @IsOptional()
  @IsString()
  declare indPag?: string;

  @IsString()
  declare tPag: string;

  @IsString()
  declare vPag: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Card)
  declare card?: ICard;

  @IsOptional()
  @IsString()
  declare xPag?: string;
}
