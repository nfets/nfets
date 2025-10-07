import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ICMSTot } from './icmstot';
import { ISSQNTot } from './issqntot';
import { RetTrib } from './ret-trib';

import type {
  Total as ITotal,
  ICMSTot as IICMSTot,
  ISSQNTot as IISSQNTot,
  RetTrib as IRetTrib,
} from '@nfets/nfe/entities/nfe/inf-nfe/total';

export class Total implements ITotal {
  @ValidateNested()
  @Type(() => ICMSTot)
  public ICMSTot!: IICMSTot;

  @IsOptional()
  @ValidateNested()
  @Type(() => ISSQNTot)
  public ISSQNtot?: IISSQNTot;

  @IsOptional()
  @ValidateNested()
  @Type(() => RetTrib)
  public retTrib?: IRetTrib;
}
