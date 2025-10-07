import { Med as IMed } from '@nfets/nfe/entities/nfe/inf-nfe/det/med';
import { IsString } from 'class-validator';
import { TransformDecimal } from '@nfets/nfe/application/validator/decimal';
import type { DecimalValue } from '@nfets/core';

export class Med implements IMed {
  @IsString()
  public cProdANVISA!: string;

  @IsString()
  public xMotivoIsencao!: string;

  @TransformDecimal({ fixed: 2 })
  public vPMC!: DecimalValue;
}
