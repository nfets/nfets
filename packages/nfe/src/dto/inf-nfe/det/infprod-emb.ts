import { IsString } from 'class-validator';
import { InfProdEmb as IInfProdEmb } from 'src/entities/nfe/inf-nfe/det/infprod-emb';
import { IsDecimal } from 'src/application/validator/decimal';

import type { DecimalValue } from '@nfets/core';

export class InfProdEmb implements IInfProdEmb {
  @IsString()
  public xEmb!: string;

  @IsDecimal()
  public qVolEmb!: DecimalValue;

  @IsString()
  public uEmb!: string;
}
