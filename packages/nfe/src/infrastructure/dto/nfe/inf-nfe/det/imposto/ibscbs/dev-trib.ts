import { DevTrib as IDevTrib } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/dev-trib';
import { TransformDecimal } from '@nfets/core/application';
import type { DecimalValue } from '@nfets/core/domain';

export class DevTrib implements IDevTrib {
  @TransformDecimal({ fixed: 2 })
  public vDevTrib!: DecimalValue;
}
