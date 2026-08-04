import type { EstornoCredTot as IEstornoCredTot } from '@nfets/nfe/domain/entities/nfe/inf-nfe/total';
import { IsOptional } from 'class-validator';
import { TransformDecimal } from '@nfets/core/application';
import type { DecimalValue } from '@nfets/core/domain';

export class EstornoCredTot implements IEstornoCredTot {
  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vIBSEstCred?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vCBSEstCred?: DecimalValue;
}
