import {
  ArrayMaxSize,
  ArrayMinSize,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { Ide } from './ide';
import { Emit } from './emit';
import { Dest } from './dest';
import { Local } from './local';
import { AutXML } from './autxml';
import { InfIntermed } from './infintermed';
import { Exporta } from './exporta';
import { Compra } from './compra';
import { InfRespTec } from './infresptec';
import { Total } from './total';
import { Transp } from './transp';
import { Cobr } from './cobr';
import { Pag } from './pag';
import { InfAdic } from './infadic';
import { Cana } from './cana';
import { Det } from './det';
import { Avulsa } from './avulsa';
import { InfSolicNFF } from './inf-solic-nff';

import type {
  InfNFeAttributes as IInfNFeAttributes,
  InfNFe as IInfNFe,
} from '@nfets/nfe/domain/entities/nfe/inf-nfe';
import type { InfAdic as IInfAdic } from '@nfets/nfe/domain/entities/nfe/inf-nfe/infadic';
import type { Cana as ICana } from '@nfets/nfe/domain/entities/nfe/inf-nfe/cana';
import type { Pag as IPag } from '@nfets/nfe/domain/entities/nfe/inf-nfe/pag';
import type { Ide as IIde } from '@nfets/nfe/domain/entities/nfe/inf-nfe/ide';
import type { Det as IDet } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det';
import type { Total as ITotal } from '@nfets/nfe/domain/entities/nfe/inf-nfe/total';
import type { Transp as ITransp } from '@nfets/nfe/domain/entities/nfe/inf-nfe/transp';
import type { Cobr as ICobr } from '@nfets/nfe/domain/entities/nfe/inf-nfe/cobr';
import type { Emit as IEmit } from '@nfets/nfe/domain/entities/nfe/inf-nfe/emit';
import type { Dest as IDest } from '@nfets/nfe/domain/entities/nfe/inf-nfe/dest';
import type { Local as ILocal } from '@nfets/nfe/domain/entities/nfe/inf-nfe/local';
import type { AutXML as IAutXML } from '@nfets/nfe/domain/entities/nfe/inf-nfe/autxml';
import type { InfIntermed as IInfIntermed } from '@nfets/nfe/domain/entities/nfe/inf-nfe/infintermed';
import type { Exporta as IExporta } from '@nfets/nfe/domain/entities/nfe/inf-nfe/exporta';
import type { Compra as ICompra } from '@nfets/nfe/domain/entities/nfe/inf-nfe/compra';
import type { InfRespTec as IInfRespTec } from '@nfets/nfe/domain/entities/nfe/inf-nfe/infresptec';
import type { Avulsa as IAvulsa } from '@nfets/nfe/domain/entities/nfe/inf-nfe/avulsa';
import type { InfSolicNFF as ISolicNFF } from '@nfets/nfe/domain/entities/nfe/inf-nfe/inf-solic-nff';

export class InfNFeAttributes implements IInfNFeAttributes {
  @IsOptional()
  @IsString()
  public Id?: string;

  @IsOptional()
  @IsString()
  public versao?: string;
}

export class InfNFe implements IInfNFe {
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => InfNFeAttributes)
  @ValidateNested()
  declare $: IInfNFeAttributes;

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Ide)
  public ide!: IIde;

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Emit)
  public emit!: IEmit;

  @IsOptional()
  @ValidateNested()
  @Type(() => Avulsa)
  public avulsa?: IAvulsa;

  @IsOptional()
  @ValidateNested()
  @Type(() => Dest)
  public dest?: IDest;

  @IsOptional()
  @ValidateNested()
  @Type(() => Local)
  public retirada?: ILocal;

  @IsOptional()
  @ValidateNested()
  @Type(() => Local)
  public entrega?: ILocal;

  @IsOptional()
  @ValidateNested({ each: true })
  @ArrayMaxSize(10)
  @Type(() => AutXML)
  public autXML?: IAutXML[];

  @ValidateNested({ each: true })
  @ArrayMaxSize(990)
  @ArrayMinSize(1)
  @Type(() => Det)
  public det!: [IDet, ...IDet[]];

  @ValidateNested()
  @Type(() => Total)
  public total!: ITotal;

  @ValidateNested()
  @Type(() => Transp)
  public transp!: ITransp;

  @IsOptional()
  @ValidateNested()
  @Type(() => Cobr)
  public cobr?: ICobr;

  @ValidateNested()
  @Type(() => Pag)
  public pag!: IPag;

  @IsOptional()
  @ValidateNested()
  @Type(() => InfIntermed)
  public infIntermed?: IInfIntermed;

  @IsOptional()
  @ValidateNested()
  @Type(() => InfAdic)
  public infAdic?: IInfAdic;

  @IsOptional()
  @ValidateNested()
  @Type(() => Exporta)
  public exporta?: IExporta;

  @IsOptional()
  @ValidateNested()
  @Type(() => Compra)
  public compra?: ICompra;

  @IsOptional()
  @ValidateNested()
  @Type(() => Cana)
  public cana?: ICana;

  @IsOptional()
  @ValidateNested()
  @Type(() => InfRespTec)
  public infRespTec?: IInfRespTec;

  @IsOptional()
  @ValidateNested()
  @Type(() => InfSolicNFF)
  public infSolicNFF?: ISolicNFF;
}
