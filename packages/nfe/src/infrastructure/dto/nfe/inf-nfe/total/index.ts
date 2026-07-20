import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ICMSTot } from './icmstot';
import { ISSQNtot } from './issqntot';
import { RetTrib } from './ret-trib';

import type {
  Total as ITotal,
  ICMSTot as IICMSTot,
  ISSQNtot as IISSQNTot,
  RetTrib as IRetTrib,
  IBSCBSTot as IIBSCBSTot,
  ISTot as IISTot,
} from '@nfets/nfe/domain/entities/nfe/inf-nfe/total';
import { IBSCBSTot } from './ibscbstot';
import { ISTot } from './istot';
import { TransformDecimal } from '@nfets/core';
import type { DecimalValue } from '@nfets/core/domain';

export class Total implements ITotal {
  @ValidateNested()
  @Type(() => ICMSTot)
  public ICMSTot!: IICMSTot;

  @IsOptional()
  @ValidateNested()
  @Type(() => ISSQNtot)
  public ISSQNtot?: IISSQNTot;

  @IsOptional()
  @ValidateNested()
  @Type(() => RetTrib)
  public retTrib?: IRetTrib;

  @IsOptional()
  @ValidateNested()
  @Type(() => ISTot)
  public ISTot?: IISTot;

  @IsOptional()
  @ValidateNested()
  @Type(() => IBSCBSTot)
  public IBSCBSTot?: IIBSCBSTot;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vNFTot?: DecimalValue;
}
