import { IsOptional, IsString } from 'class-validator';
import { Case } from '@nfets/nfe/application/validator/switch-case';
import { Transporta as ITransporta } from '@nfets/nfe/entities/nfe/inf-nfe/transp';

export class Transporta implements ITransporta {
  @IsOptional()
  @IsString()
  @Case()
  public CNPJ?: string;

  @IsOptional()
  @IsString()
  @Case()
  public CPF?: string;

  @IsOptional()
  @IsString()
  public xNome?: string;

  @IsOptional()
  @IsString()
  public IE?: string;

  @IsOptional()
  @IsString()
  public xEnder?: string;

  @IsOptional()
  @IsString()
  public xMun?: string;

  @IsOptional()
  @IsString()
  public UF?: string;
}
