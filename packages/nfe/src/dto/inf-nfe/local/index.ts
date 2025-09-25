import { IsOptional, IsString } from 'class-validator';
import { Local as ILocal } from 'src/entities/nfe/inf-nfe/local';

export class Local implements ILocal {
  @IsOptional()
  @IsString()
  declare CNPJ?: string;

  @IsOptional()
  @IsString()
  declare CPF?: string;

  @IsOptional()
  @IsString()
  declare xNome?: string;

  @IsString()
  declare xLgr: string;

  @IsString()
  declare nro: string;

  @IsOptional()
  @IsString()
  declare xCpl?: string;

  @IsString()
  declare xBairro: string;

  @IsString()
  declare cMun: string;

  @IsString()
  declare xMun: string;

  @IsString()
  declare UF: string;

  @IsOptional()
  @IsString()
  declare CEP?: string;

  @IsOptional()
  @IsString()
  declare cPais?: string;

  @IsOptional()
  @IsString()
  declare xPais?: string;

  @IsOptional()
  @IsString()
  declare fone?: string;

  @IsOptional()
  @IsString()
  declare email?: string;

  @IsOptional()
  @IsString()
  declare IE?: string;
}
