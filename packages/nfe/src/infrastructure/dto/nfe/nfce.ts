import { Type } from 'class-transformer';
import { InfNFeSupl } from './inf-nfe-supl';
import { NFe } from './nfe';
import type { NFCe as INFCe } from '@nfets/nfe/domain/entities/nfe/nfce';
import type { InfNFeSupl as IInfNFeSupl } from '@nfets/nfe/domain/entities/nfe/inf-nfe-supl';

export class NFCe extends NFe implements INFCe {
  @Type(() => InfNFeSupl)
  public infNFeSupl!: IInfNFeSupl;
}
