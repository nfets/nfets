import {
  ArrayMaxSize,
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
import { Transp as ITransp } from '@nfets/nfe/domain/entities/nfe/inf-nfe/transp';
import { SwitchCase } from '@nfets/core/application';

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
  @SwitchCase()
  public veicTransp?: IVeicTransp;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Reboque)
  @ArrayMaxSize(5)
  @SwitchCase({ allow: ['veicTransp'] })
  public reboque?: IReboque[];

  @IsOptional()
  @IsString()
  @SwitchCase()
  public vagao?: string;

  @IsOptional()
  @IsString()
  @SwitchCase()
  public balsa?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Vol)
  @ArrayMaxSize(5000)
  public vol?: IVol[];
}
