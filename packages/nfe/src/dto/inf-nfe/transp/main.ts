import {
  IsDefined,
  IsIn,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transporta } from './transporta';
import { RetTransp } from './ret-transp';
import { VeicTransp, Reboque } from './veic';
import { Vol } from './vol';

export class Transp {
  @IsDefined()
  @IsString()
  @IsIn(['0', '1', '2', '3', '4', '9'])
  declare modFrete: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Transporta)
  declare transporta?: Transporta;

  @IsOptional()
  @ValidateNested()
  @Type(() => RetTransp)
  declare retTransp?: RetTransp;

  @IsOptional()
  @ValidateNested()
  @Type(() => VeicTransp)
  declare veicTransp?: VeicTransp;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Reboque)
  declare reboque?: Reboque[];

  @IsOptional()
  @IsString()
  declare vagao?: string;

  @IsOptional()
  @IsString()
  declare balsa?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Vol)
  declare vol?: Vol[];
}
