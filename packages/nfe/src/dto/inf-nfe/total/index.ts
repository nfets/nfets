import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ICMSTot } from './icmstot';
import { ISSQNTot } from './issqntot';
import { Total as ITotal } from 'src/entities/nfe/inf-nfe/total';

export class Total implements ITotal {
  @ValidateNested()
  declare ICMSTot: ICMSTot;

  @IsOptional()
  @ValidateNested()
  @Type(() => ISSQNTot)
  declare ISSQNtot?: ISSQNTot;
}
