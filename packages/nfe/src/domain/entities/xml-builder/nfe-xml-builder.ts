import type { Either, DeepPartial } from '@nfets/core/shared';
import type { NFeTsError } from '@nfets/core/domain';

import type { Ide } from '@nfets/nfe/domain/entities/nfe/inf-nfe/ide';
import type { InfNFeAttributes } from '@nfets/nfe/domain/entities/nfe/inf-nfe';
import type { Emit as IEmit } from '@nfets/nfe/domain/entities/nfe/inf-nfe/emit';
import type { Dest as IDest } from '@nfets/nfe/domain/entities/nfe/inf-nfe/dest';
import type { Pag as IPag } from '@nfets/nfe/domain/entities/nfe/inf-nfe/pag';
import type { AssembleDetXmlBuilder, ProdBuilder } from './nfe-det-xml-builder';
import type {
  ICMSTot as IICMSTot,
  ISSQNtot as IISSQNTot,
  IBSCBSTot as IIBSCBSTot,
  ISTot as IISTot,
  Total as ITotal,
} from '@nfets/nfe/domain/entities/nfe/inf-nfe/total';
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
import type { Det as IDet } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det';
import type { Agropecuario as IAgropecuario } from '@nfets/nfe/domain/entities/nfe/inf-nfe/agropecuario';
import type { InfPAA as IInfPAA } from '@nfets/nfe/domain/entities/nfe/inf-nfe/inf-paa';

import type { DefaultSchema, Schema } from '../transmission/schemas';

export interface InfNFeBuilder<
  T extends object,
  S extends Schema = typeof DefaultSchema,
> {
  infNFe(payload: InfNFeAttributes): IdeBuilder<T, S>;
}

export interface IdeBuilder<
  T extends object,
  S extends Schema = typeof DefaultSchema,
> {
  ide(payload: Ide): EmitBuilder<T, S>;
}

export interface EmitBuilder<
  T extends object,
  S extends Schema = typeof DefaultSchema,
> {
  emit(
    payload: IEmit,
  ): AvulsaBuilder<T, S> &
    DestBuilder<T, S> &
    RetiradaBuilder<T, S> &
    EntregaBuilder<T, S> &
    AutXMLBuilder<T, S> &
    DetGroupBuilder<T, S>;
}

export interface AvulsaBuilder<
  T extends object,
  S extends Schema = typeof DefaultSchema,
> {
  avulsa(
    payload?: IAvulsa,
  ): DestBuilder<T, S> &
    RetiradaBuilder<T, S> &
    EntregaBuilder<T, S> &
    AutXMLBuilder<T, S> &
    DetGroupBuilder<T, S>;
}

export interface DestBuilder<
  T extends object,
  S extends Schema = typeof DefaultSchema,
> {
  dest(
    payload?: IDest,
  ): RetiradaBuilder<T, S> &
    EntregaBuilder<T, S> &
    AutXMLBuilder<T, S> &
    DetGroupBuilder<T, S>;
}

export interface RetiradaBuilder<
  T extends object,
  S extends Schema = typeof DefaultSchema,
> {
  retirada(
    payload?: ILocal,
  ): DestBuilder<T, S> &
    EntregaBuilder<T, S> &
    AutXMLBuilder<T, S> &
    DetGroupBuilder<T, S>;
}

export interface EntregaBuilder<
  T extends object,
  S extends Schema = typeof DefaultSchema,
> {
  entrega(
    payload?: ILocal,
  ): DestBuilder<T, S> & AutXMLBuilder<T, S> & DetGroupBuilder<T, S>;
}

export interface AutXMLBuilder<
  T extends object,
  S extends Schema = typeof DefaultSchema,
> {
  autXML(payload?: IAutXML): AutXMLBuilder<T, S> & DetGroupBuilder<T, S>;
}

export interface DetGroupBuilder<
  T extends object,
  S extends Schema = typeof DefaultSchema,
> {
  det<D>(
    items: [D, ...D[]],
    build: (ctx: ProdBuilder<S>, item: D) => AssembleDetXmlBuilder,
  ): TotalBuilder<T, S> & TranspBuilder<T, S>;
}

/**
 * XSD order (total):
 *   ICMSTot → ISSQNtot? → retTrib? → ISTot? → IBSCBSTot? → vNFTot?
 */
export interface TotalBuilder<
  T extends object,
  S extends Schema = typeof DefaultSchema,
> {
  total(payload: ITotal): TranspBuilder<T, S>;
  ISSQNtot(
    payload?: Partial<IISSQNTot>,
  ): TranspBuilder<T, S> & TotalBuilder<T, S>;
  ICMSTot(
    payload?: Partial<IICMSTot>,
  ): TranspBuilder<T, S> & TotalBuilder<T, S>;
  ISTot(
    payload?: IISTot,
  ): TranspBuilder<T, S> & TotalBuilder<T, S> & IbsCbsTotBuilder<T, S>;
  IBSCBSTot(
    payload?: IIBSCBSTot,
  ): TranspBuilder<T, S> & TotalBuilder<T, S> & IsTotBuilder<T, S>;
  increment(
    callback: (
      context: DeepPartial<ITotal>,
      det: DeepPartial<IDet[]>,
    ) => DeepPartial<ITotal>,
  ): TranspBuilder<T, S>;
}

export interface IsTotBuilder<
  T extends object,
  S extends Schema = typeof DefaultSchema,
> {
  ISTot(
    payload?: IISTot,
  ): TranspBuilder<T, S> & TotalBuilder<T, S> & IbsCbsTotBuilder<T, S>;
}

export interface IbsCbsTotBuilder<
  T extends object,
  S extends Schema = typeof DefaultSchema,
> {
  IBSCBSTot(
    payload?: IIBSCBSTot,
  ): TranspBuilder<T, S> & TotalBuilder<T, S> & IsTotBuilder<T, S>;
}

export interface TranspBuilder<
  T extends object,
  S extends Schema = typeof DefaultSchema,
> {
  transp(payload: ITransp): CobrBuilder<T, S> & PagBuilder<T, S>;
}

export interface CobrBuilder<
  T extends object,
  S extends Schema = typeof DefaultSchema,
> {
  cobr(payload?: ICobr): PagBuilder<T, S>;
}

/**
 * XSD order (after pag):
 *   infIntermed? → infAdic? → exporta? → compra? → cana? →
 *   infRespTec? → infSolicNFF? → agropecuario? → infPAA?
 */
export interface PagBuilder<
  T extends object,
  S extends Schema = typeof DefaultSchema,
> {
  pag(
    payload: IPag,
  ): AssembleNfeBuilder<T, S> &
    AvulsaBuilder<T, S> &
    InfAdicBuilder<T, S> &
    InfSolicNFFBuilder<T, S> &
    CanaBuilder<T, S> &
    CompraBuilder<T, S> &
    ExportaBuilder<T, S> &
    InfRespTecBuilder<T, S> &
    InfIntermedBuilder<T, S> &
    AgropecuarioBuilder<T, S> &
    InfPAABuilder<T, S>;
}

export interface InfIntermedBuilder<
  T extends object,
  S extends Schema = typeof DefaultSchema,
> {
  infIntermed(
    payload?: IInfIntermed,
  ): AssembleNfeBuilder<T, S> &
    AvulsaBuilder<T, S> &
    InfAdicBuilder<T, S> &
    InfSolicNFFBuilder<T, S> &
    CanaBuilder<T, S> &
    CompraBuilder<T, S> &
    InfRespTecBuilder<T, S> &
    ExportaBuilder<T, S> &
    AgropecuarioBuilder<T, S> &
    InfPAABuilder<T, S>;
}

export interface InfAdicBuilder<
  T extends object,
  S extends Schema = typeof DefaultSchema,
> {
  infAdic(
    payload?: IInfAdic,
  ): AssembleNfeBuilder<T, S> &
    AvulsaBuilder<T, S> &
    InfSolicNFFBuilder<T, S> &
    InfRespTecBuilder<T, S> &
    CanaBuilder<T, S> &
    CompraBuilder<T, S> &
    ExportaBuilder<T, S> &
    AgropecuarioBuilder<T, S> &
    InfPAABuilder<T, S>;
}

export interface ExportaBuilder<
  T extends object,
  S extends Schema = typeof DefaultSchema,
> {
  exporta(
    payload?: IExporta,
  ): AssembleNfeBuilder<T, S> &
    AvulsaBuilder<T, S> &
    InfAdicBuilder<T, S> &
    InfSolicNFFBuilder<T, S> &
    InfRespTecBuilder<T, S> &
    CanaBuilder<T, S> &
    CompraBuilder<T, S> &
    AgropecuarioBuilder<T, S> &
    InfPAABuilder<T, S>;
}

export interface CompraBuilder<
  T extends object,
  S extends Schema = typeof DefaultSchema,
> {
  compra(
    payload?: ICompra,
  ): AssembleNfeBuilder<T, S> &
    AvulsaBuilder<T, S> &
    InfAdicBuilder<T, S> &
    InfSolicNFFBuilder<T, S> &
    InfRespTecBuilder<T, S> &
    CanaBuilder<T, S> &
    AgropecuarioBuilder<T, S> &
    InfPAABuilder<T, S>;
}

export interface CanaBuilder<
  T extends object,
  S extends Schema = typeof DefaultSchema,
> {
  cana(
    payload?: ICana,
  ): AssembleNfeBuilder<T, S> &
    AvulsaBuilder<T, S> &
    InfAdicBuilder<T, S> &
    InfSolicNFFBuilder<T, S> &
    InfRespTecBuilder<T, S> &
    AgropecuarioBuilder<T, S> &
    InfPAABuilder<T, S>;
}

export interface InfRespTecBuilder<
  T extends object,
  S extends Schema = typeof DefaultSchema,
> {
  infRespTec(
    payload?: IInfRespTec,
  ): AssembleNfeBuilder<T, S> &
    AvulsaBuilder<T, S> &
    InfAdicBuilder<T, S> &
    InfSolicNFFBuilder<T, S> &
    AgropecuarioBuilder<T, S> &
    InfPAABuilder<T, S>;
}

export interface InfSolicNFFBuilder<
  T extends object,
  S extends Schema = typeof DefaultSchema,
> {
  infSolicNFF(
    payload?: ISolicNFF,
  ): AssembleNfeBuilder<T, S> &
    InfAdicBuilder<T, S> &
    AvulsaBuilder<T, S> &
    AgropecuarioBuilder<T, S> &
    InfPAABuilder<T, S>;
}

export interface AgropecuarioBuilder<
  T extends object,
  S extends Schema = typeof DefaultSchema,
> {
  agropecuario(
    payload?: IAgropecuario,
  ): AssembleNfeBuilder<T, S> &
    InfAdicBuilder<T, S> &
    AvulsaBuilder<T, S> &
    InfPAABuilder<T, S>;
}

export interface InfPAABuilder<
  T extends object,
  S extends Schema = typeof DefaultSchema,
> {
  infPAA(
    payload?: IInfPAA,
  ): AssembleNfeBuilder<T, S> & InfAdicBuilder<T, S> & AvulsaBuilder<T, S>;
}

export interface AssembleNfeBuilder<
  T extends object,
  S extends Schema = typeof DefaultSchema,
> {
  quiet(): AssembleNfeBuilder<T, S>;
  toObject(): Either<NFeTsError, T>;
  assemble(): Promise<Either<NFeTsError, string>>;
}

export interface INfeXmlBuilder<
  T extends object,
  S extends Schema = typeof DefaultSchema,
>
  extends
    InfNFeBuilder<T, S>,
    IdeBuilder<T, S>,
    DetGroupBuilder<T, S>,
    DestBuilder<T, S>,
    RetiradaBuilder<T, S>,
    EntregaBuilder<T, S>,
    AutXMLBuilder<T, S>,
    TotalBuilder<T, S>,
    IsTotBuilder<T, S>,
    IbsCbsTotBuilder<T, S>,
    TranspBuilder<T, S>,
    PagBuilder<T, S>,
    InfIntermedBuilder<T, S>,
    ExportaBuilder<T, S>,
    CompraBuilder<T, S>,
    CanaBuilder<T, S>,
    InfRespTecBuilder<T, S>,
    InfSolicNFFBuilder<T, S>,
    InfAdicBuilder<T, S>,
    AgropecuarioBuilder<T, S>,
    InfPAABuilder<T, S>,
    AvulsaBuilder<T, S>,
    AssembleNfeBuilder<T, S> {
  readonly schema: S;
}
