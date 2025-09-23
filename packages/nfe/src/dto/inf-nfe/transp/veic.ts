import { IsOptional, IsString } from 'class-validator';
import {
  VeicTransp as IVeicTransp,
  Reboque as IReboque,
} from 'src/entities/nfe/inf-nfe/transp';

export class VeicTransp implements IVeicTransp {
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

export class Reboque implements IReboque {
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
