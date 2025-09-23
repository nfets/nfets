import {
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
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
  @IsDefined()
  @IsString()
  declare modFrete: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Transporta)
  declare transporta?: ITransporta;

  @IsOptional()
  @ValidateNested()
  @Type(() => RetTransp)
  declare retTransp?: IRetTransp;

  @IsOptional()
  @ValidateNested()
  @Type(() => VeicTransp)
  declare veicTransp?: IVeicTransp;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Reboque)
  declare reboque?: IReboque[];

  @IsOptional()
  @IsString()
  declare vagao?: string;

  @IsOptional()
  @IsString()
  declare balsa?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Vol)
  declare vol?: IVol[];
}
