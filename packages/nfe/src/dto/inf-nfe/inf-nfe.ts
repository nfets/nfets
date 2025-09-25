import {
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

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
} from 'src/entities/nfe/inf-nfe';
import type { InfAdic as IInfAdic } from 'src/entities/nfe/inf-nfe/infadic';
import type { Cana as ICana } from 'src/entities/nfe/inf-nfe/cana';
import type { Pag as IPag } from 'src/entities/nfe/inf-nfe/pag';
import type { Ide as IIde } from 'src/entities/nfe/inf-nfe/ide';
import type { Det as IDet } from 'src/entities/nfe/inf-nfe/det';
import type { Total as ITotal } from 'src/entities/nfe/inf-nfe/total';
import type { Transp as ITransp } from 'src/entities/nfe/inf-nfe/transp';
import type { Cobr as ICobr } from 'src/entities/nfe/inf-nfe/cobr';
import type { Emit as IEmit } from 'src/entities/nfe/inf-nfe/emit';
import type { Dest as IDest } from 'src/entities/nfe/inf-nfe/dest';
import type { Local as ILocal } from 'src/entities/nfe/inf-nfe/local';
import type { AutXML as IAutXML } from 'src/entities/nfe/inf-nfe/autxml';
import type { InfIntermed as IInfIntermed } from 'src/entities/nfe/inf-nfe/infintermed';
import type { Exporta as IExporta } from 'src/entities/nfe/inf-nfe/exporta';
import type { Compra as ICompra } from 'src/entities/nfe/inf-nfe/compra';
import type { InfRespTec as IInfRespTec } from 'src/entities/nfe/inf-nfe/infresptec';

export class InfNFeAttributes implements IInfNFeAttributes {
  @IsOptional()
  @IsString()
  declare Id?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string | undefined }): string =>
    typeof value === 'string' && value !== '' ? value : '4.00',
  )
  declare versao?: string;
}

export class InfNFe implements IInfNFe {
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => InfNFeAttributes)
  declare $: IInfNFeAttributes;

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Ide)
  declare ide: IIde;

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Emit)
  declare emit: IEmit;

  @IsOptional()
  @ValidateNested()
  @Type(() => Dest)
  declare dest?: IDest;

  @IsOptional()
  @ValidateNested()
  @Type(() => Local)
  declare retirada?: ILocal;

  @IsOptional()
  @ValidateNested()
  @Type(() => Local)
  declare entrega?: ILocal;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AutXML)
  declare autXML?: IAutXML[];

  @IsOptional()
  @ValidateNested()
  @Type(() => InfIntermed)
  declare infIntermed?: IInfIntermed;

  @IsOptional()
  @ValidateNested()
  @Type(() => Exporta)
  declare exporta?: IExporta;

  @IsOptional()
  @ValidateNested()
  @Type(() => Compra)
  declare compra?: ICompra;

  @IsOptional()
  @ValidateNested()
  @Type(() => InfRespTec)
  declare infRespTec?: IInfRespTec;

  @ValidateNested({ each: true })
  @Type(() => Det)
  declare det: IDet[];

  @ValidateNested()
  @Type(() => Total)
  declare total: ITotal;

  @ValidateNested()
  @Type(() => Transp)
  declare transp: ITransp;

  @IsOptional()
  @ValidateNested()
  @Type(() => Cobr)
  declare cobr?: ICobr;

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
