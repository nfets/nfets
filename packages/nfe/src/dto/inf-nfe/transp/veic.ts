import { IsOptional, IsString } from 'class-validator';

export class VeicTransp {
  @IsOptional()
  @IsString()
  declare placa?: string;

  @IsOptional()
  @IsString()
  declare UF?: string;

  @IsOptional()
  @IsString()
  declare RNTC?: string;
}

export class Reboque {
  @IsOptional()
  @IsString()
  declare placa?: string;

  @IsOptional()
  @IsString()
  declare UF?: string;

  @IsOptional()
  @IsString()
  declare RNTC?: string;
}
