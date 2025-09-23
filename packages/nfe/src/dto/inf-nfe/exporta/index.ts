import { IsDefined, IsOptional, IsString } from 'class-validator';
import type { Exporta as IExporta } from 'src/entities/nfe/inf-nfe/exporta';

export class Exporta implements IExporta {
  @IsDefined()
  @IsString()
  declare UFSaidaPais: string;

  @IsOptional()
  @IsString()
  declare xLocExporta?: string;

  @IsOptional()
  @IsString()
  declare xLocDespacho?: string;
}
