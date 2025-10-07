import type { DecimalValue } from '@nfets/core';
import {
  ArrayMaxSize,
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Prod as IProd } from '@nfets/nfe/entities/nfe/inf-nfe/det/prod';
import { TransformDecimal } from '@nfets/nfe/application/validator/decimal';
import { Type } from 'class-transformer';
import type { DI as IDI } from '@nfets/nfe/entities/nfe/inf-nfe/det/di';
import type { DetExport as IDetExport } from '@nfets/nfe/entities/nfe/inf-nfe/det/det-export';
import type { Rastro as IRastro } from '@nfets/nfe/entities/nfe/inf-nfe/det/rastro';
import type { InfProdNFF as IInfProdNFF } from '@nfets/nfe/entities/nfe/inf-nfe/det/infprod-nff';
import type { InfProdEmb as IInfProdEmb } from '@nfets/nfe/entities/nfe/inf-nfe/det/infprod-emb';
import type { VeicProd as IVeicProd } from '@nfets/nfe/entities/nfe/inf-nfe/det/veic-prod';
import type { Med as IMed } from '@nfets/nfe/entities/nfe/inf-nfe/det/med';
import type { Arma as IArma } from '@nfets/nfe/entities/nfe/inf-nfe/det/arma';
import type { Comb as IComb } from '@nfets/nfe/entities/nfe/inf-nfe/det/comb';

import { Rastro } from './rastro';
import { Case } from '@nfets/nfe/application/validator/switch-case';
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

  @TransformDecimal({ fixed: 4 })
  public qCom!: DecimalValue;

  @TransformDecimal({ fixed: 10 })
  public vUnCom!: DecimalValue;

  @TransformDecimal({ fixed: 2 })
  public vProd!: DecimalValue;

  @IsString()
  public cEANTrib!: string;

  @IsString()
  public uTrib!: string;

  @TransformDecimal({ fixed: 4 })
  public qTrib!: DecimalValue;

  @TransformDecimal({ fixed: 10 })
  public vUnTrib!: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vFrete?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vSeg?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
  public vDesc?: DecimalValue;

  @IsOptional()
  @TransformDecimal({ fixed: 2 })
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
