import { IsOptional, IsString } from 'class-validator';

export class Card {
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
