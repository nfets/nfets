import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Transporta, Transporta as ITransporta } from './transporta';
import { RetTransp, RetTransp as IRetTransp } from './ret-transp';
import {
  VeicTransp,
  VeicTransp as IVeicTransp,
  Reboque,
  Reboque as IReboque,
} from './veic';
import { Vol, Vol as IVol } from './vol';
import { Transp as ITransp } from 'src/entities/nfe/inf-nfe/transp';

export class Transp implements ITransp {
  @IsString()
  public modFrete!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Transporta)
  public transporta?: ITransporta;

  @IsOptional()
  @ValidateNested()
  @Type(() => RetTransp)
  public retTransp?: IRetTransp;

  @IsOptional()
  @ValidateNested()
  @Type(() => VeicTransp)
  public veicTransp?: IVeicTransp;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Reboque)
  public reboque?: IReboque[];

  @IsOptional()
  @IsString()
  public vagao?: string;

  @IsOptional()
  @IsString()
  public balsa?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Vol)
  public vol?: IVol[];
}
