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
import { Transp as ITransp } from 'src/entities/nfe/inf-nfe/transp';
import { Case } from 'src/application/validator/switch-case';

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
  @Case()
  public veicTransp?: IVeicTransp;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Reboque)
  @ArrayMaxSize(5)
  @Case({ allow: ['veicTransp'] })
  public reboque?: IReboque[];

  @IsOptional()
  @IsString()
  @Case()
  public vagao?: string;

  @IsOptional()
  @IsString()
  @Case()
  public balsa?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Vol)
  @ArrayMaxSize(5000)
  public vol?: IVol[];
}
