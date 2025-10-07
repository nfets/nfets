import { IsOptional, IsString } from 'class-validator';
import type { Exporta as IExporta } from '@nfets/nfe/entities/nfe/inf-nfe/exporta';

export class Exporta implements IExporta {
  @IsString()
  public UFSaidaPais!: string;

  @IsOptional()
  @IsString()
  public xLocExporta?: string;

  @IsOptional()
  @IsString()
  public xLocDespacho?: string;
}
