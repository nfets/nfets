import { type CBSTot as ICBSTot } from '@nfets/nfe/domain/entities/nfe/inf-nfe/total';
import { TransformDecimal } from '@nfets/core/application';
import type { DecimalValue } from '@nfets/core/domain';
import { IsOptional } from 'class-validator';

export class CBSTot implements ICBSTot {
  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vDif: DecimalValue = '0.00';

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vDevTrib: DecimalValue = '0.00';

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vCBS: DecimalValue = '0.00';

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vCredPres: DecimalValue = '0.00';

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vCredPresCondSus: DecimalValue = '0.00';
}
