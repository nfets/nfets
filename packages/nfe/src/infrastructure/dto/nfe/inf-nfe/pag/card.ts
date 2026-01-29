import { IsOptional, IsString } from 'class-validator';
import { Card as ICard } from '@nfets/nfe/domain/entities/nfe/inf-nfe/pag';

export class Card implements ICard {
  @IsOptional()
  @IsString()
  public CNPJ?: string;

  @IsOptional()
  @IsString()
  public tBand?: string;

  @IsOptional()
  @IsString()
  public cAut?: string;

  @IsOptional()
  @IsString()
  public tpIntegra?: string;

  @IsOptional()
  @IsString()
  public CNPJReceb?: string;

  @IsOptional()
  @IsString()
  public idTermPag?: string;
}
