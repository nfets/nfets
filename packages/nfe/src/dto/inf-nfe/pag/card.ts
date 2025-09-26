import { IsOptional, IsString } from 'class-validator';
import { Card as ICard } from 'src/entities/nfe/inf-nfe/pag';

export class Card implements ICard {
  @IsOptional()
  @IsString()
  public cNPJ?: string;

  @IsOptional()
  @IsString()
  public tBand?: string;

  @IsOptional()
  @IsString()
  public cAut?: string;
}
