import type { DeepPartial } from '@nfets/core';

import type { Ide } from 'src/entities/nfe/inf-nfe/ide';
import type { InfNFeAttributes } from 'src/entities/nfe/inf-nfe';
import type { Emit as IEmit } from 'src/entities/nfe/inf-nfe/emit';
import type { Dest as IDest } from 'src/entities/nfe/inf-nfe/dest';
import type { Pag as IPag } from 'src/entities/nfe/inf-nfe/pag';
import type { AssembleDetXmlBuilder, ProdBuilder } from './nfe-det-xml-builder';
import type { Total as ITotal } from 'src/entities/nfe/inf-nfe/total';
import type { Transp as ITransp } from 'src/entities/nfe/inf-nfe/transp';
import type { Cobr as ICobr } from 'src/entities/nfe/inf-nfe/cobr';
import type { NFe } from 'src/entities/nfe/nfe';
import type { InfIntermed as IInfIntermed } from 'src/entities/nfe/inf-nfe/infintermed';
import type { Exporta as IExporta } from 'src/entities/nfe/inf-nfe/exporta';
import type { Compra as ICompra } from 'src/entities/nfe/inf-nfe/compra';
import type { Cana as ICana } from 'src/entities/nfe/inf-nfe/cana';
import type { InfRespTec as IInfRespTec } from 'src/entities/nfe/inf-nfe/infresptec';
import type { InfSolicNFF as ISolicNFF } from 'src/entities/nfe/inf-nfe/inf-solic-nff';
import type { InfAdic as IInfAdic } from 'src/entities/nfe/inf-nfe/infadic';
import type { Avulsa as IAvulsa } from 'src/entities/nfe/inf-nfe/avulsa';
import type { Local as ILocal } from 'src/entities/nfe/inf-nfe/local';
import type { AutXML as IAutXML } from 'src/entities/nfe/inf-nfe/autxml';

export interface InfNFeBuilder {
  infNFe(payload: InfNFeAttributes): IdeBuilder;
}

export interface IdeBuilder {
  ide(payload: Ide): EmitBuilder;
}

export interface EmitBuilder {
  emit(
    payload: IEmit,
  ): AvulsaBuilder &
    DestBuilder &
    RetiradaBuilder &
    EntregaBuilder &
    AutXMLBuilder &
    DetBuilder;
}

export interface AvulsaBuilder {
  avulsa(
    payload: IAvulsa,
  ): DestBuilder &
    RetiradaBuilder &
    EntregaBuilder &
    AutXMLBuilder &
    DetBuilder &
    AssembleNfeBuilder;
}

export interface DestBuilder {
  dest(
    payload: IDest,
  ): RetiradaBuilder &
    EntregaBuilder &
    AutXMLBuilder &
    DetBuilder &
    AssembleNfeBuilder;
}

export interface RetiradaBuilder {
  retirada(
    payload: ILocal,
  ): DestBuilder &
    EntregaBuilder &
    AutXMLBuilder &
    DetBuilder &
    AssembleNfeBuilder;
}

export interface EntregaBuilder {
  entrega(
    payload: ILocal,
  ): DestBuilder & AutXMLBuilder & DetBuilder & AssembleNfeBuilder;
}

export interface AutXMLBuilder {
  autXML(payload: IAutXML): AutXMLBuilder & DetBuilder & AssembleNfeBuilder;
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
  pag(
    payload: IPag,
  ): AssembleNfeBuilder &
    AvulsaBuilder &
    InfAdicBuilder &
    InfSolicNFFBuilder &
    CanaBuilder &
    CompraBuilder &
    ExportaBuilder &
    InfIntermedBuilder;
}

export interface InfIntermedBuilder {
  infIntermed(
    payload: IInfIntermed,
  ): AssembleNfeBuilder &
    AvulsaBuilder &
    InfAdicBuilder &
    InfSolicNFFBuilder &
    CanaBuilder &
    CompraBuilder &
    ExportaBuilder;
}

export interface InfAdicBuilder {
  infAdic(
    payload: IInfAdic,
  ): AssembleNfeBuilder &
    AvulsaBuilder &
    InfAdicBuilder &
    InfSolicNFFBuilder &
    CanaBuilder &
    CompraBuilder &
    ExportaBuilder;
}
export interface ExportaBuilder {
  exporta(
    payload: IExporta,
  ): AssembleNfeBuilder &
    AvulsaBuilder &
    InfAdicBuilder &
    InfSolicNFFBuilder &
    CanaBuilder &
    CompraBuilder;
}

export interface CompraBuilder {
  compra(
    payload: ICompra,
  ): AssembleNfeBuilder &
    AvulsaBuilder &
    InfAdicBuilder &
    InfSolicNFFBuilder &
    CanaBuilder;
}

export interface CanaBuilder {
  cana(
    payload: ICana,
  ): AssembleNfeBuilder &
    AvulsaBuilder &
    InfAdicBuilder &
    InfSolicNFFBuilder &
    InfRespTecBuilder;
}

export interface InfRespTecBuilder {
  infRespTec(
    payload: IInfRespTec,
  ): AssembleNfeBuilder & AvulsaBuilder & InfAdicBuilder & InfSolicNFFBuilder;
}

export interface InfSolicNFFBuilder {
  infSolicNFF(
    payload: ISolicNFF,
  ): AssembleNfeBuilder & InfAdicBuilder & AvulsaBuilder;
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
    DestBuilder,
    RetiradaBuilder,
    EntregaBuilder,
    AutXMLBuilder,
    TotalBuilder,
    TranspBuilder,
    PagBuilder,
    InfIntermedBuilder,
    ExportaBuilder,
    CompraBuilder,
    CanaBuilder,
    InfRespTecBuilder,
    InfSolicNFFBuilder,
    InfAdicBuilder,
    AvulsaBuilder,
    AssembleNfeBuilder {}
