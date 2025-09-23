import {
  IsDefined,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Prod } from './prod';

import { Imposto } from './imposto';
import { Devol } from './imposto/devol';

import type {
  Det as IDet,
  DetAttributes as IDetAttributes,
} from 'src/entities/nfe/inf-nfe/det';
import type { Devol as IDevol } from 'src/entities/nfe/inf-nfe/det/imposto/devol';
import type { Prod as IProd } from 'src/entities/nfe/inf-nfe/det/prod';
import type { Imposto as IImposto } from 'src/entities/nfe/inf-nfe/det/imposto';

export class DetAttributes implements IDetAttributes {
  @IsString()
  declare nItem: string;
}

export class Det implements IDet {
  @IsObject()
  @ValidateNested()
  @Type(() => DetAttributes)
  declare $: IDetAttributes;

  @IsDefined()
  @ValidateNested()
  @Type(() => Prod)
  declare prod: IProd;

  @IsOptional()
  @ValidateNested()
  @Type(() => Imposto)
  declare imposto?: IImposto;

  @IsOptional()
  @ValidateNested()
  @Type(() => Devol)
  declare impostoDevol?: IDevol;

  @IsOptional()
  @IsString()
  declare infAdProd?: string;
}
