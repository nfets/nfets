import {
  IsDefined,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DetAttributes } from './attributes';
import { Prod } from './prod';

import { ImpostoDevol } from './imposto-devol';
import { Imposto } from './imposto';

export class Det {
  @IsObject()
  @ValidateNested()
  @Type(() => DetAttributes)
  declare $: DetAttributes;

  @IsDefined()
  @ValidateNested()
  @Type(() => Prod)
  declare prod: Prod;

  @IsOptional()
  @ValidateNested()
  @Type(() => Imposto)
  declare imposto?: Imposto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ImpostoDevol)
  declare impostoDevol?: ImpostoDevol;

  @IsOptional()
  @IsString()
  declare infAdProd?: string;
}
