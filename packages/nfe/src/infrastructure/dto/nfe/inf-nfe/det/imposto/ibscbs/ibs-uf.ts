import { IBSUF as IIBSUF } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/ibs-uf';
import { IsOptional, ValidateNested } from 'class-validator';
import { TransformDecimal } from '@nfets/core/application';
import type { DecimalValue } from '@nfets/core/domain';
import { Type } from 'class-transformer';
import { DevTrib } from './dev-trib';
import { Dif } from './dif';
import { Red } from './red';

export class IBSUF implements IIBSUF {
  @TransformDecimal({ fixed: 4 })
  public pIBSUF!: DecimalValue;

  @IsOptional()
  @ValidateNested()
  @Type(() => Dif)
  public gDif?: Dif;

  @IsOptional()
  @ValidateNested()
  @Type(() => DevTrib)
  public gDevTrib?: DevTrib;

  @IsOptional()
  @ValidateNested()
  @Type(() => Red)
  public gRed?: Red;

  @TransformDecimal({ fixed: 2 })
  public vIBSUF!: DecimalValue;
}
