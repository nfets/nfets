import type { Ide } from 'src/entities/nfe/inf-nfe/ide';
import type { InfNFeAttributes } from 'src/entities/nfe/inf-nfe';
import type { Emit as IEmit } from 'src/entities/nfe/inf-nfe/emit';
import type { Pag as IPag } from 'src/entities/nfe/inf-nfe/pag';
import type { AssembleDetXmlBuilder, ProdBuilder } from './nfe-det-xml-builder';
import type { Total as ITotal } from 'src/entities/nfe/inf-nfe/total';
import type { Transp as ITransp } from 'src/entities/nfe/inf-nfe/transp';
import type { Cobr as ICobr } from 'src/entities/nfe/inf-nfe/cobr';
import type { DeepPartial } from '@nfets/core';
import type { NFe } from '../nfe/nfe';

export interface InfNFeBuilder {
  infNFe(payload: InfNFeAttributes): IdeBuilder;
}

export interface IdeBuilder {
  ide(payload: Ide): EmitBuilder;
}

export interface EmitBuilder {
  emit(payload: IEmit): DetBuilder;
}

export interface DetBuilder {
  det<T>(
    items: [T, ...T[]],
    build: (ctx: ProdBuilder, item: T) => AssembleDetXmlBuilder,
  ): TotalBuilder & TranspBuilder;
}

export interface TotalBuilder {
  total(payload: ITotal): TranspBuilder;
  increment(
    callback: (context: DeepPartial<ITotal>) => DeepPartial<ITotal>,
  ): TranspBuilder;
}

export interface TranspBuilder {
  transp(payload: ITransp): CobrBuilder & PagBuilder;
}

export interface CobrBuilder {
  cobr(payload: ICobr): PagBuilder;
}

export interface PagBuilder {
  pag(payload: IPag): AssembleNfeBuilder;
}

export interface AssembleNfeBuilder {
  quiet(): AssembleNfeBuilder;
  toObject(): NFe;
  assemble(): Promise<string>;
}

export interface INfeXmlBuilder
  extends InfNFeBuilder,
    IdeBuilder,
    DetBuilder,
    TotalBuilder,
    TranspBuilder,
    PagBuilder,
    AssembleNfeBuilder {}
