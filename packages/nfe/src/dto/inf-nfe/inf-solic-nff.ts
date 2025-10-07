import { IsString } from 'class-validator';
import { InfSolicNFF as ISolicNFF } from '@nfets/nfe/entities/nfe/inf-nfe/inf-solic-nff';

export class InfSolicNFF implements ISolicNFF {
  @IsString()
  public xSolic!: string;
}
