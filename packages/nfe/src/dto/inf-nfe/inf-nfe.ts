import {
  IsIn,
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

export class InfNFeAttributes {
  @IsOptional()
  @IsString()
  declare Id?: string;

  @IsOptional()
  @IsString()
  @IsIn(['4.00'])
  declare versao?: string;
}

export class InfNFe {
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => InfNFeAttributes)
  declare $: InfNFeAttributes;

  @IsObject()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => Ide)
  declare ide: Ide;

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
  declare det: Det[];

  @IsDefined()
  @ValidateNested()
  @Type(() => Total)
  declare total: Total;

  @IsDefined()
  @ValidateNested()
  @Type(() => Transp)
  declare transp: Transp;

  @IsOptional()
  @ValidateNested()
  @Type(() => Cobr)
  declare cobr?: Cobr;

  @IsDefined()
  @ValidateNested()
  @Type(() => Pag)
  declare pag: Pag;

  @IsOptional()
  @ValidateNested()
  @Type(() => InfAdic)
  declare infAdic?: InfAdic;

  @IsOptional()
  @ValidateNested()
  @Type(() => Cana)
  declare cana?: Cana;
}
