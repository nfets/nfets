import { IsOptional, IsString } from 'class-validator';
import { Card as ICard } from 'src/entities/nfe/inf-nfe/pag';

export class Card implements ICard {
  @IsOptional()
  @IsString()
  declare cNPJ?: string;

  @IsOptional()
  @IsString()
  declare tBand?: string;

  @IsOptional()
  @IsString()
  declare cAut?: string;
}
