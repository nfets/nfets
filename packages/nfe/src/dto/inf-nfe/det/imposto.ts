import { Type } from 'class-transformer';
import { IsNumber, IsOptional, ValidateNested } from 'class-validator';

import { ICMS } from './imposto/icms';
import { IPI } from './imposto/ipi';
import { II } from './imposto/ii';
import { PIS, PISST } from './imposto/pis';
import { COFINS, COFINSST } from './imposto/cofins';
import { ISSQN } from './imposto/issqn';
import { ICMSUFDest } from './imposto/icmsufdest';

import type { Imposto as IImposto } from 'src/entities/nfe/inf-nfe/det/imposto';
import type { ICMS as IICMS } from 'src/entities/nfe/inf-nfe/det/imposto/icms';
import type { IPI as IIPI } from 'src/entities/nfe/inf-nfe/det/imposto/ipi';
import type { II as III } from 'src/entities/nfe/inf-nfe/det/imposto/ii';
import type { PIS as IPIS } from 'src/entities/nfe/inf-nfe/det/imposto/pis';
import type { PISST as IPISST } from 'src/entities/nfe/inf-nfe/det/imposto/pis';
import type { COFINS as ICOFINS } from 'src/entities/nfe/inf-nfe/det/imposto/cofins';
import type { COFINSST as ICOFINSST } from 'src/entities/nfe/inf-nfe/det/imposto/cofins';
import type { ISSQN as IISSQN } from 'src/entities/nfe/inf-nfe/det/imposto/issqn';
import type { ICMSUFDest as IICMSUFDest } from 'src/entities/nfe/inf-nfe/det/imposto/icmsufdest';

export class Imposto implements IImposto {
  @IsOptional()
  @IsNumber()
  public vTotTrib?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMS)
  public ICMS?: IICMS;

  @IsOptional()
  @ValidateNested()
  @Type(() => IPI)
  public IPI?: IIPI;

  @IsOptional()
  @ValidateNested()
  @Type(() => II)
  public II?: III;

  @IsOptional()
  @ValidateNested()
  @Type(() => PIS)
  public PIS?: IPIS;

  @IsOptional()
  @ValidateNested()
  @Type(() => PISST)
  public PISST?: IPISST;

  @IsOptional()
  @ValidateNested()
  @Type(() => COFINS)
  public COFINS?: ICOFINS;

  @IsOptional()
  @ValidateNested()
  @Type(() => COFINSST)
  public COFINSST?: ICOFINSST;

  @IsOptional()
  @ValidateNested()
  @Type(() => ISSQN)
  public ISSQN?: IISSQN;

  @IsOptional()
  @ValidateNested()
  @Type(() => ICMSUFDest)
  public ICMSUFDest?: IICMSUFDest;
}
