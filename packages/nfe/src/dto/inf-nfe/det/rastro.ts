import { IsOptional, IsString } from 'class-validator';
import { Rastro as IRastro } from 'src/entities/nfe/inf-nfe/det/rastro';

export class Rastro implements IRastro {
  @IsString()
  public nLote!: string;

  @IsOptional()
  @IsString()
  public qLote!: string;

  @IsOptional()
  @IsString()
  public dFab!: string;

  @IsOptional()
  @IsString()
  public dVal!: string;

  @IsOptional()
  @IsString()
  public cAgreg?: string;
}
