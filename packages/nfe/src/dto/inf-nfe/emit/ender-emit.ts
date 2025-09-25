import { IsOptional, IsString } from 'class-validator';
import type { EnderEmit as IEnderEmit } from 'src/entities/nfe/inf-nfe/emit';

export class EnderEmit implements IEnderEmit {
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
