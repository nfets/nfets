import type { DecimalValue } from '@nfets/core';
import {
  ArrayMaxSize,
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Prod as IProd } from 'src/entities/nfe/inf-nfe/det/prod';
import { IsDecimal } from 'src/application/validator/decimal';
import { Type } from 'class-transformer';
import type { DI as IDI } from 'src/entities/nfe/inf-nfe/det/di';
import type { DetExport as IDetExport } from 'src/entities/nfe/inf-nfe/det/det-export';
import type { Rastro as IRastro } from 'src/entities/nfe/inf-nfe/det/rastro';
import type { InfProdNFF as IInfProdNFF } from 'src/entities/nfe/inf-nfe/det/infprod-nff';
import type { InfProdEmb as IInfProdEmb } from 'src/entities/nfe/inf-nfe/det/infprod-emb';
import type { VeicProd as IVeicProd } from 'src/entities/nfe/inf-nfe/det/veic-prod';
import type { Med as IMed } from 'src/entities/nfe/inf-nfe/det/med';
import type { Arma as IArma } from 'src/entities/nfe/inf-nfe/det/arma';
import type { Comb as IComb } from 'src/entities/nfe/inf-nfe/det/comb';

import { Rastro } from './rastro';
import { Case } from 'src/application/validator/switch-case';
import { DI } from './di';
import { DetExport } from './det-export';
import { InfProdNFF } from './infprod-nff';
import { InfProdEmb } from './infprod-emb';
import { VeicProd } from './veic-prod';
import { Med } from './med';
import { Arma } from './arma';
import { Comb } from './comb';

export class Prod implements IProd {
  @IsString()
  public cProd!: string;

  @IsString()
  public cEAN!: string;

  @IsOptional()
  @IsString()
  public cBarra?: string;

  @IsString()
  public xProd!: string;

  @IsString()
  public NCM!: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(8)
  @IsString({ each: true })
  public NVE?: string[];

  @IsOptional()
  @IsString()
  public CEST?: string;

  @IsOptional()
  @IsString()
  public indEscala?: string;

  @IsOptional()
  @IsString()
  public CNPJFab?: string;

  @IsOptional()
  @IsString()
  public cBenef?: string;

  @IsOptional()
  @IsObject()
  public gCred?: unknown;

  @IsOptional()
  @IsString()
  public EXTIPI?: string;

  @IsString()
  public CFOP!: string;

  @IsString()
  public uCom!: string;

  @IsDecimal()
  public qCom!: DecimalValue;

  @IsDecimal()
  public vUnCom!: DecimalValue;

  @IsDecimal()
  public vProd!: DecimalValue;

  @IsString()
  public cEANTrib!: string;

  @IsString()
  public uTrib!: string;

  @IsDecimal()
  public qTrib!: DecimalValue;

  @IsDecimal()
  public vUnTrib!: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vFrete?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vSeg?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vDesc?: DecimalValue;

  @IsOptional()
  @IsDecimal()
  public vOutro?: DecimalValue;

  @IsString()
  public indTot!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(100)
  @Type(() => DI)
  public DI?: IDI[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(500)
  @Type(() => DetExport)
  public detExport?: IDetExport[];

  @IsOptional()
  @IsString()
  public xPed?: string;

  @IsOptional()
  @IsString()
  public nItemPed?: string;

  @IsOptional()
  @IsString()
  public nFCI?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(500)
  @Type(() => Rastro)
  public rastro?: IRastro[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => InfProdNFF)
  public infProdNFF?: IInfProdNFF;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => InfProdEmb)
  public infProdEmb?: IInfProdEmb;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => VeicProd)
  @Case()
  public veicProd?: IVeicProd;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Med)
  @Case()
  public med?: IMed;

  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => Arma)
  @ArrayMaxSize(500)
  @Case()
  public arma?: IArma[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Comb)
  @Case()
  public comb?: IComb;

  @IsOptional()
  @IsString()
  public nRECOPI?: string;
}
