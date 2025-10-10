import { IsOptional, IsString } from 'class-validator';
import type { EnderDest as IEnderDest } from '@nfets/nfe/domain/entities/nfe/inf-nfe/dest';

export class EnderDest implements IEnderDest {
  @IsOptional()
  @IsString()
  public xLgr?: string;

  @IsOptional()
  @IsString()
  public nro?: string;

  @IsOptional()
  @IsString()
  public xCpl?: string;

  @IsOptional()
  @IsString()
  public xBairro?: string;

  @IsOptional()
  @IsString()
  public cMun?: string;

  @IsOptional()
  @IsString()
  public xMun?: string;

  @IsOptional()
  @IsString()
  public UF?: string;

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
}
