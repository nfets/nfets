import { IsOptional, IsString } from 'class-validator';
import { Local as ILocal } from 'src/entities/nfe/inf-nfe/local';

export class Local implements ILocal {
  @IsOptional()
  @IsString()
  public CNPJ?: string;

  @IsOptional()
  @IsString()
  public CPF?: string;

  @IsOptional()
  @IsString()
  public xNome?: string;

  @IsString()
  public xLgr!: string;

  @IsString()
  public nro!: string;

  @IsOptional()
  @IsString()
  public xCpl?: string;

  @IsString()
  public xBairro!: string;

  @IsString()
  public cMun!: string;

  @IsString()
  public xMun!: string;

  @IsString()
  public UF!: string;

  @IsOptional()
  @IsString()
  public CEP?: string;

  @IsOptional()
  @IsString()
  public cPais?: string;

  @IsOptional()
  @IsString()
  public xPais?: string;

  @IsOptional()
  @IsString()
  public fone?: string;

  @IsOptional()
  @IsString()
  public email?: string;

  @IsOptional()
  @IsString()
  public IE?: string;
}
