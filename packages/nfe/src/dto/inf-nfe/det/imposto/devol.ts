import {
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import type { IpiDevol as IIpiDevol } from 'src/entities/nfe/inf-nfe/det/imposto/devol';
import type { Devol as IDevol } from 'src/entities/nfe/inf-nfe/det/imposto/devol';

export class IpiDevol implements IIpiDevol {
  @IsDefined()
  @IsString()
  declare vIPIDevol: string;
}

export class Devol implements IDevol {
  @IsDefined()
  @IsString()
  declare pDevol: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => IpiDevol)
  declare IPI?: IIpiDevol;
}
