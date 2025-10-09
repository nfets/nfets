import { IsString } from 'class-validator';
import { InfProdEmb as IInfProdEmb } from '@nfets/nfe/entities/nfe/inf-nfe/det/infprod-emb';
import { TransformDecimal } from '@nfets/core/application';

import type { DecimalValue } from '@nfets/core/domain';

export class InfProdEmb implements IInfProdEmb {
  @IsString()
  public xEmb!: string;

  @TransformDecimal({ fixed: 3 })
  public qVolEmb!: DecimalValue;

  @IsString()
  public uEmb!: string;
}
