import { IsOptional, ValidateNested } from 'class-validator';
import { IBSMunTot } from './ibs-mun-tot';
import { Type } from 'class-transformer';
import { IBSUFTot } from './ibs-uf-tot';

import { TransformDecimal } from '@nfets/core/application';
import type { DecimalValue } from '@nfets/core/domain';

import {
  type IBSMunTot as IIBSMunTot,
  type IBSUFTot as IIBSUFTot,
  type IBSTot as IIBSTot,
} from '@nfets/nfe/domain/entities/nfe/inf-nfe/total';

export class IBSTot implements IIBSTot {
  @IsOptional()
  @ValidateNested()
  @Type(() => IBSUFTot)
  public gIBSUF?: IIBSUFTot;

  @IsOptional()
  @ValidateNested()
  @Type(() => IBSMunTot)
  public gIBSMun?: IIBSMunTot;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vIBS: DecimalValue = '0.00';

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vCredPres: DecimalValue = '0.00';

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vCredPresCondSus: DecimalValue = '0.00';
}
