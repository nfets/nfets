import { IsOptional, IsString } from 'class-validator';
import { Choice } from '@nfets/core/application';
import { Transporta as ITransporta } from '@nfets/nfe/domain/entities/nfe/inf-nfe/transp';

@Choice({ properties: ['CNPJ', 'CPF'] })
export class Transporta implements ITransporta {
  @IsOptional()
  @IsString()
  public CNPJ?: string;

  @IsOptional()
  @IsString()
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
