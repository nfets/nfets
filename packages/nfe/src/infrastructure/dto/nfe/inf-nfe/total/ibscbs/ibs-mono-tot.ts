import { IBSMonoTot as IIBSMonoTot } from '@nfets/nfe/domain/entities/nfe/inf-nfe/total';
import { TransformDecimal } from '@nfets/core/application';
import type { DecimalValue } from '@nfets/core/domain';

export class IBSMonoTot implements IIBSMonoTot {
  @TransformDecimal({ fixed: 2 })
  public vIBSMono: DecimalValue = '0.00';

  @TransformDecimal({ fixed: 2 })
  public vCBSMono: DecimalValue = '0.00';

  @TransformDecimal({ fixed: 2 })
  public vIBSMonoReten: DecimalValue = '0.00';

  @TransformDecimal({ fixed: 2 })
  public vCBSMonoReten: DecimalValue = '0.00';

  @TransformDecimal({ fixed: 2 })
  public vIBSMonoRet: DecimalValue = '0.00';

  @TransformDecimal({ fixed: 2 })
  public vCBSMonoRet: DecimalValue = '0.00';
}
