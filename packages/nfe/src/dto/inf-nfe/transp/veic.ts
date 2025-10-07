import { IsOptional, IsString } from 'class-validator';
import {
  VeicTransp as IVeicTransp,
  Reboque as IReboque,
} from '@nfets/nfe/entities/nfe/inf-nfe/transp';

export class VeicTransp implements IVeicTransp {
  @IsOptional()
  @IsString()
  public placa?: string;

  @IsOptional()
  @IsString()
  public UF?: string;

  @IsOptional()
  @IsString()
  public RNTC?: string;
}

export class Reboque implements IReboque {
  @IsOptional()
  @IsString()
  public placa?: string;

  @IsOptional()
  @IsString()
  public UF?: string;

  @IsOptional()
  @IsString()
  public RNTC?: string;
}
