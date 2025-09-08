import { IsDefined, IsOptional, IsString } from 'class-validator';

export class Exporta {
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
