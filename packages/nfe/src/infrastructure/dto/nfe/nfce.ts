import { Type } from 'class-transformer';
import { InfNFeSupl } from './inf-nfe-supl';
import { NFe } from './nfe';
import type { NFCe as INfce } from '@nfets/nfe/domain/entities/nfe/nfce';
import type { InfNFeSupl as IInfNFeSupl } from '@nfets/nfe/domain/entities/nfe/inf-nfe-supl';

export class NFCe extends NFe implements INfce {
  @Type(() => InfNFeSupl)
  public infNFeSupl!: IInfNFeSupl;
}
