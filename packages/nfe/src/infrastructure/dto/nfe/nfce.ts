import { Type } from 'class-transformer';
import {
  Allow,
  IsNotEmptyObject,
  IsObject,
  ValidateNested,
} from 'class-validator';

import type { Signature } from '@nfets/core/domain';

import { InfNFeSupl } from './inf-nfe-supl';
import { NFeAttributes } from './nfe';
import { InfNFe } from './inf-nfe/inf-nfe';
import type { NFeAttributes as INFeAttributes } from '@nfets/nfe/domain/entities/nfe/nfe';
import type { InfNFe as IInfNFe } from '@nfets/nfe/domain/entities/nfe/inf-nfe';
import type { InfNFeSupl as IInfNFeSupl } from '@nfets/nfe/domain/entities/nfe/inf-nfe-supl';
import type { NFCe as INFCe } from '@nfets/nfe/domain/entities/nfe/nfce';

export class NFCe implements INFCe {
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => NFeAttributes)
  @ValidateNested()
  public $!: INFeAttributes;

  @IsObject()
  @IsNotEmptyObject()
  @Type(() => InfNFe)
  @ValidateNested()
  public infNFe!: IInfNFe;

  @Type(() => InfNFeSupl)
  public infNFeSupl!: IInfNFeSupl;

  @Allow()
  public Signature?: Signature;
}
