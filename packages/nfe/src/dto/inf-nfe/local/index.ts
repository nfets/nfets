import { IsOptional, IsString } from 'class-validator';
import { Case } from '@nfets/nfe/application/validator/switch-case';
import { Local as ILocal } from '@nfets/nfe/entities/nfe/inf-nfe/local';

export class Local implements ILocal {
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
