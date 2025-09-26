import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Card, Card as ICard } from './card';
import { DetPag as IDetPag } from 'src/entities/nfe/inf-nfe/pag';

export class DetPag implements IDetPag {
  @IsOptional()
  @IsString()
  public indPag?: string;

  @IsString()
  public tPag!: string;

  @IsString()
  public vPag!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Card)
  public card?: ICard;

  @IsOptional()
  @IsString()
  public xPag?: string;
}
