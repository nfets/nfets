import { Med as IMed } from 'src/entities/nfe/inf-nfe/det/med';
import { IsString } from 'class-validator';
import { TransformDecimal } from 'src/application/validator/decimal';
import type { DecimalValue } from '@nfets/core';

export class Med implements IMed {
  @IsString()
  public cProdANVISA!: string;

  @IsString()
  public xMotivoIsencao!: string;

  @TransformDecimal({ fixed: 2 })
  public vPMC!: DecimalValue;
}
