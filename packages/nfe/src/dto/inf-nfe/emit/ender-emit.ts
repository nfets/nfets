import { IsDefined, IsOptional, IsString } from 'class-validator';

export class EnderEmit {
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

  @IsDefined()
  @IsString()
  declare CEP: string;

  @IsOptional()
  @IsString()
  declare cPais?: string;

  @IsOptional()
  @IsString()
  declare xPais?: string;

  @IsOptional()
  @IsString()
  declare fone?: string;
}
