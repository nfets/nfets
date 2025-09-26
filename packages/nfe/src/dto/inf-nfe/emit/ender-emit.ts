import { IsOptional, IsString } from 'class-validator';
import type { EnderEmit as IEnderEmit } from 'src/entities/nfe/inf-nfe/emit';

export class EnderEmit implements IEnderEmit {
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

  @IsString()
  public CEP!: string;

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
