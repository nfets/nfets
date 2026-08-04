import { DevTrib as IDevTrib } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/dev-trib';
import { TransformDecimal } from '@nfets/core/application';
import type { DecimalValue } from '@nfets/core/domain';
import { IsOptional } from 'class-validator';

export class DevTrib implements IDevTrib {
  @IsOptional()
  @TransformDecimal({ fixed: 4 })
  public pDevTrib?: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vDevTrib!: DecimalValue;
}
