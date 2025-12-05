import type { Either, DeepPartial } from '@nfets/core/shared';
import type { NFeTsError } from '@nfets/core/domain';

import type { Ide } from '@nfets/nfe/domain/entities/nfe/inf-nfe/ide';
import type { InfNFeAttributes } from '@nfets/nfe/domain/entities/nfe/inf-nfe';
import type { Emit as IEmit } from '@nfets/nfe/domain/entities/nfe/inf-nfe/emit';
import type { Dest as IDest } from '@nfets/nfe/domain/entities/nfe/inf-nfe/dest';
import type { Pag as IPag } from '@nfets/nfe/domain/entities/nfe/inf-nfe/pag';
import type { AssembleDetXmlBuilder, ProdBuilder } from './nfe-det-xml-builder';
import type { Total as ITotal } from '@nfets/nfe/domain/entities/nfe/inf-nfe/total';
import type { Transp as ITransp } from '@nfets/nfe/domain/entities/nfe/inf-nfe/transp';
import type { Cobr as ICobr } from '@nfets/nfe/domain/entities/nfe/inf-nfe/cobr';
import type { InfIntermed as IInfIntermed } from '@nfets/nfe/domain/entities/nfe/inf-nfe/infintermed';
import type { Exporta as IExporta } from '@nfets/nfe/domain/entities/nfe/inf-nfe/exporta';
import type { Compra as ICompra } from '@nfets/nfe/domain/entities/nfe/inf-nfe/compra';
import type { Cana as ICana } from '@nfets/nfe/domain/entities/nfe/inf-nfe/cana';
import type { InfRespTec as IInfRespTec } from '@nfets/nfe/domain/entities/nfe/inf-nfe/infresptec';
import type { InfSolicNFF as ISolicNFF } from '@nfets/nfe/domain/entities/nfe/inf-nfe/inf-solic-nff';
import type { InfAdic as IInfAdic } from '@nfets/nfe/domain/entities/nfe/inf-nfe/infadic';
import type { Avulsa as IAvulsa } from '@nfets/nfe/domain/entities/nfe/inf-nfe/avulsa';
import type { Local as ILocal } from '@nfets/nfe/domain/entities/nfe/inf-nfe/local';
import type { AutXML as IAutXML } from '@nfets/nfe/domain/entities/nfe/inf-nfe/autxml';

export interface InfNFeBuilder<T extends object> {
  infNFe(payload: InfNFeAttributes): IdeBuilder<T>;
}

export interface IdeBuilder<T extends object> {
  ide(payload: Ide): EmitBuilder<T>;
}

export interface EmitBuilder<T extends object> {
  emit(
    payload: IEmit,
  ): AvulsaBuilder<T> &
    DestBuilder<T> &
    RetiradaBuilder<T> &
    EntregaBuilder<T> &
    AutXMLBuilder<T> &
    DetGroupBuilder<T>;
}

export interface AvulsaBuilder<T extends object> {
  avulsa(
    payload: IAvulsa,
  ): DestBuilder<T> &
    RetiradaBuilder<T> &
    EntregaBuilder<T> &
    AutXMLBuilder<T> &
    DetGroupBuilder<T>;
}

export interface DestBuilder<T extends object> {
  dest(
    payload: IDest,
  ): RetiradaBuilder<T> &
    EntregaBuilder<T> &
    AutXMLBuilder<T> &
    DetGroupBuilder<T>;
}

export interface RetiradaBuilder<T extends object> {
  retirada(
    payload: ILocal,
  ): DestBuilder<T> & EntregaBuilder<T> & AutXMLBuilder<T> & DetGroupBuilder<T>;
}

export interface EntregaBuilder<T extends object> {
  entrega(
    payload: ILocal,
  ): DestBuilder<T> & AutXMLBuilder<T> & DetGroupBuilder<T>;
}

export interface AutXMLBuilder<T extends object> {
  autXML(payload: IAutXML): AutXMLBuilder<T> & DetGroupBuilder<T>;
}

export interface DetGroupBuilder<T extends object> {
  det<D>(
    items: [D, ...D[]],
    build: (ctx: ProdBuilder, item: D) => AssembleDetXmlBuilder,
  ): TotalBuilder<T> & TranspBuilder<T>;
}

export interface TotalBuilder<T extends object> {
  total(payload: ITotal): TranspBuilder<T>;
  increment(
    callback: (context: DeepPartial<ITotal>) => DeepPartial<ITotal>,
  ): TranspBuilder<T>;
}

export interface TranspBuilder<T extends object> {
  transp(payload: ITransp): CobrBuilder<T> & PagBuilder<T>;
}

export interface CobrBuilder<T extends object> {
  cobr(payload: ICobr): PagBuilder<T>;
}

export interface PagBuilder<T extends object> {
  pag(
    payload: IPag,
  ): AssembleNfeBuilder<T> &
    AvulsaBuilder<T> &
    InfAdicBuilder<T> &
    InfSolicNFFBuilder<T> &
    CanaBuilder<T> &
    CompraBuilder<T> &
    ExportaBuilder<T> &
    InfRespTecBuilder<T> &
    InfIntermedBuilder<T>;
}

export interface InfIntermedBuilder<T extends object> {
  infIntermed(
    payload: IInfIntermed,
  ): AssembleNfeBuilder<T> &
    AvulsaBuilder<T> &
    InfAdicBuilder<T> &
    InfSolicNFFBuilder<T> &
    CanaBuilder<T> &
    CompraBuilder<T> &
    InfRespTecBuilder<T> &
    ExportaBuilder<T>;
}

export interface InfAdicBuilder<T extends object> {
  infAdic(
    payload: IInfAdic,
  ): AssembleNfeBuilder<T> &
    AvulsaBuilder<T> &
    InfAdicBuilder<T> &
    InfSolicNFFBuilder<T> &
    InfRespTecBuilder<T> &
    CanaBuilder<T> &
    CompraBuilder<T> &
    ExportaBuilder<T>;
}
export interface ExportaBuilder<T extends object> {
  exporta(
    payload: IExporta,
  ): AssembleNfeBuilder<T> &
    AvulsaBuilder<T> &
    InfAdicBuilder<T> &
    InfSolicNFFBuilder<T> &
    InfRespTecBuilder<T> &
    CanaBuilder<T> &
    CompraBuilder<T>;
}

export interface CompraBuilder<T extends object> {
  compra(
    payload: ICompra,
  ): AssembleNfeBuilder<T> &
    AvulsaBuilder<T> &
    InfAdicBuilder<T> &
    InfSolicNFFBuilder<T> &
    InfRespTecBuilder<T> &
    CanaBuilder<T>;
}

export interface CanaBuilder<T extends object> {
  cana(
    payload: ICana,
  ): AssembleNfeBuilder<T> &
    AvulsaBuilder<T> &
    InfAdicBuilder<T> &
    InfSolicNFFBuilder<T> &
    InfRespTecBuilder<T>;
}

export interface InfRespTecBuilder<T extends object> {
  infRespTec(
    payload: IInfRespTec,
  ): AssembleNfeBuilder<T> &
    AvulsaBuilder<T> &
    InfAdicBuilder<T> &
    InfSolicNFFBuilder<T>;
}

export interface InfSolicNFFBuilder<T extends object> {
  infSolicNFF(
    payload: ISolicNFF,
  ): AssembleNfeBuilder<T> & InfAdicBuilder<T> & AvulsaBuilder<T>;
}

export interface AssembleNfeBuilder<T extends object> {
  quiet(): AssembleNfeBuilder<T>;
  toObject(): Either<NFeTsError, T>;
  assemble(): Promise<Either<NFeTsError, string>>;
}

export interface INfeXmlBuilder<T extends object>
  extends InfNFeBuilder<T>,
    IdeBuilder<T>,
    DetGroupBuilder<T>,
    DestBuilder<T>,
    RetiradaBuilder<T>,
    EntregaBuilder<T>,
    AutXMLBuilder<T>,
    TotalBuilder<T>,
    TranspBuilder<T>,
    PagBuilder<T>,
    InfIntermedBuilder<T>,
    ExportaBuilder<T>,
    CompraBuilder<T>,
    CanaBuilder<T>,
    InfRespTecBuilder<T>,
    InfSolicNFFBuilder<T>,
    InfAdicBuilder<T>,
    AvulsaBuilder<T>,
    AssembleNfeBuilder<T> {}
