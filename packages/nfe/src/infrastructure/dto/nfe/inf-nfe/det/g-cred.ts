import { IsString } from 'class-validator';
import { GCred as IGCred } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/g-cred';
import { TransformDecimal } from '@nfets/core/application';

import type { DecimalValue } from '@nfets/core/domain';

export class GCred implements IGCred {
  @IsString()
  public cCredPresumido!: string;

  @TransformDecimal({ fixed: 4 })
  public pCredPresumido!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vCredPresumido!: DecimalValue;
}
