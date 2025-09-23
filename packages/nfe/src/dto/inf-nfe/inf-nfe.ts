import {
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
  IsDefined,
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

import type {
  InfNFeAttributes as IInfNFeAttributes,
  InfNFe as IInfNFe,
} from 'src/entities/nfe/inf-nfe/inf-nfe';
import type { InfAdic as IInfAdic } from 'src/entities/nfe/inf-nfe/infadic';
import type { Cana as ICana } from 'src/entities/nfe/inf-nfe/cana';
import type { Pag as IPag } from 'src/entities/nfe/inf-nfe/pag';
import type { Ide as IIde } from 'src/entities/nfe/inf-nfe/ide';
import type { Det as IDet } from 'src/entities/nfe/inf-nfe/det';
import type { Total as ITotal } from 'src/entities/nfe/inf-nfe/total';
import type { Transp as ITransp } from 'src/entities/nfe/inf-nfe/transp';

export class InfNFeAttributes implements IInfNFeAttributes {
  @IsOptional()
  @IsString()
  declare Id?: string;

  @IsOptional()
  @IsString()
  declare versao?: string;
}

export class InfNFe implements IInfNFe {
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => InfNFeAttributes)
  declare $: InfNFeAttributes;

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Ide)
  declare ide: IIde;

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Emit)
  declare emit: Emit;

  @IsOptional()
  @ValidateNested()
  @Type(() => Dest)
  declare dest?: Dest;

  @IsOptional()
  @ValidateNested()
  @Type(() => Local)
  declare retirada?: Local;

  @IsOptional()
  @ValidateNested()
  @Type(() => Local)
  declare entrega?: Local;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AutXML)
  declare autXML?: AutXML[];

  @IsOptional()
  @ValidateNested()
  @Type(() => InfIntermed)
  declare infIntermed?: InfIntermed;

  @IsOptional()
  @ValidateNested()
  @Type(() => Exporta)
  declare exporta?: Exporta;

  @IsOptional()
  @ValidateNested()
  @Type(() => Compra)
  declare compra?: Compra;

  @IsOptional()
  @ValidateNested()
  @Type(() => InfRespTec)
  declare infRespTec?: InfRespTec;

  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => Det)
  declare det: IDet[];

  @IsDefined()
  @ValidateNested()
  @Type(() => Total)
  declare total: ITotal;

  @IsDefined()
  @ValidateNested()
  @Type(() => Transp)
  declare transp: ITransp;

  @IsOptional()
  @ValidateNested()
  @Type(() => Cobr)
  declare cobr?: Cobr;

  @IsDefined()
  @ValidateNested()
  @Type(() => Pag)
  declare pag: IPag;

  @IsOptional()
  @ValidateNested()
  @Type(() => InfAdic)
  declare infAdic?: IInfAdic;

  @IsOptional()
  @ValidateNested()
  @Type(() => Cana)
  declare cana?: ICana;
}
