import {
  type IBSTot as IIBSTot,
  type CBSTot as ICBSTot,
  type IBSCBSTot as IIBSCBSTot,
  type IBSMonoTot as IIBSMonoTot,
} from '@nfets/nfe/domain/entities/nfe/inf-nfe/total';
import { ValidateNested } from 'class-validator';
import type { DecimalValue } from '@nfets/core/domain';
import { IBSTot } from './ibscbs/ibs-tot';
import { TransformDecimal } from '@nfets/core';
import { Type } from 'class-transformer';
import { CBSTot } from './ibscbs/cbs-tot';
import { IBSMonoTot } from './ibscbs/ibs-mono-tot';

export class IBSCBSTot implements IIBSCBSTot {
  @TransformDecimal({ fixed: 2 })
  public vBCIBSCBS: DecimalValue = '0.00';

  @ValidateNested()
  @Type(() => IBSTot)
  public gIBS!: IIBSTot;

  @ValidateNested()
  @Type(() => CBSTot)
  public gCBS!: ICBSTot;

  @ValidateNested()
  @Type(() => IBSMonoTot)
  public gMono!: IIBSMonoTot;
}
