import { IsOptional, IsString } from 'class-validator';

export class EnderDest {
  @IsOptional()
  @IsString()
  declare xLgr?: string;

  @IsOptional()
  @IsString()
  declare nro?: string;

  @IsOptional()
  @IsString()
  declare xCpl?: string;

  @IsOptional()
  @IsString()
  declare xBairro?: string;

  @IsOptional()
  @IsString()
  declare cMun?: string;

  @IsOptional()
  @IsString()
  declare xMun?: string;

  @IsOptional()
  @IsString()
  declare UF?: string;

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
}
