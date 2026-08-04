import { ALCZFMCBS as IALCZFMCBS } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/alc-zfm-cbs';
import { TransformDecimal } from '@nfets/core/application';
import type { DecimalValue } from '@nfets/core/domain';
import { IsOptional, IsString } from 'class-validator';

export class ALCZFMCBS implements IALCZFMCBS {
  @IsString()
  public tpALCZFMCBS!: string;

  @IsOptional()
  @IsString()
  public nProcSuframa?: string;

  @TransformDecimal({ fixed: 4 })
  public pAliqEfetRegCBS!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vTribRegCBS!: DecimalValue;
}
