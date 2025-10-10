import { Med as IMed } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/med';
import { IsString } from 'class-validator';
import { TransformDecimal } from '@nfets/core/application';
import type { DecimalValue } from '@nfets/core/domain';

export class Med implements IMed {
  @IsString()
  public cProdANVISA!: string;

  @IsString()
  public xMotivoIsencao!: string;

  @TransformDecimal({ fixed: 2 })
  public vPMC!: DecimalValue;
}
