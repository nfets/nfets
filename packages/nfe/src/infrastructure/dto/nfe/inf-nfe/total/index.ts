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
  IBSCBSTot as IIBSCBSTot,
} from '@nfets/nfe/domain/entities/nfe/inf-nfe/total';
import { IBSCBSTot } from './ibscbstot';
import { TransformDecimal } from '@nfets/core';
import type { DecimalValue } from '@nfets/core/domain';

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

  @IsOptional()
  @ValidateNested()
  @Type(() => IBSCBSTot)
  public IBSCBSTot?: IIBSCBSTot;

  @TransformDecimal({ fixed: 2 })
  public vNFTot?: DecimalValue;
}
