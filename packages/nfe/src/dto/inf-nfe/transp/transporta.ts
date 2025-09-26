import { IsOptional, IsString } from 'class-validator';
import { Transporta as ITransporta } from 'src/entities/nfe/inf-nfe/transp';

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
