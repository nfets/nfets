import { GIBSCBS as IGIBSCBS } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/gibscbs';
import { IsOptional, ValidateNested } from 'class-validator';
import { TransformDecimal } from '@nfets/core/application';
import type { DecimalValue } from '@nfets/core/domain';
import { TribRegular } from './trib-regular';
import { Type } from 'class-transformer';
import { IBSMun } from './ibs-mun';
import { IBSUF } from './ibs-uf';
import { CBS } from './cbs';

export class GIBSCBS implements IGIBSCBS {
  @TransformDecimal({ fixed: 2 })
  public vBC!: DecimalValue;

  @IsOptional()
  @ValidateNested()
  @Type(() => IBSUF)
  public gIBSUF?: IBSUF;

  @IsOptional()
  @ValidateNested()
  @Type(() => IBSMun)
  public gIBSMun?: IBSMun;

  @TransformDecimal({ fixed: 2 })
  public vIBS!: DecimalValue;

  @IsOptional()
  @ValidateNested()
  @Type(() => CBS)
  public gCBS?: CBS;

  @IsOptional()
  @ValidateNested()
  @Type(() => TribRegular)
  public gTribRegular?: TribRegular;
}
