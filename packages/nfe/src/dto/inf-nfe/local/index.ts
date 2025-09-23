import { IsDefined, IsOptional, IsString } from 'class-validator';
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

  @IsDefined()
  @IsString()
  declare xLgr: string;

  @IsDefined()
  @IsString()
  declare nro: string;

  @IsOptional()
  @IsString()
  declare xCpl?: string;

  @IsDefined()
  @IsString()
  declare xBairro: string;

  @IsDefined()
  @IsString()
  declare cMun: string;

  @IsDefined()
  @IsString()
  declare xMun: string;

  @IsDefined()
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
