import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import type { IpiDevol as IIpiDevol } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto-devol';
import type { Devol as IDevol } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto-devol';

export class IpiDevol implements IIpiDevol {
  @IsString()
  public vIPIDevol!: string;
}

export class Devol implements IDevol {
  @IsString()
  public pDevol!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => IpiDevol)
  public IPI?: IIpiDevol;
}
