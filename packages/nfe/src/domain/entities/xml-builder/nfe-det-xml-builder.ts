import type {
  Det,
  DetAttributes,
} from '@nfets/nfe/domain/entities/nfe/inf-nfe/det';
import type { Imposto } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto';
import type {
  COFINS,
  COFINSST,
} from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/cofins';
import type { ICMS } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/icms';
import type { ICMSUFDest } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/icmsufdest';
import type { II } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ii';
import type { IPI } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ipi';
import type { ISSQN } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/issqn';
import type {
  PIS,
  PISST,
} from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/pis';
import type { Prod } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/prod';
import type { Schema } from '@nfets/nfe/domain/entities/transmission/schemas';
import type { IS } from '../nfe/inf-nfe/det/imposto/is';
import type { IBSCBS } from '../nfe/inf-nfe/det/imposto/ibscbs';
import type { DFeReferenciado } from '../nfe/inf-nfe/det/dfe-referenciado';
import type { VItem } from '../nfe/inf-nfe/det/v-item';

export interface DetBuilder<S extends Schema> {
  det($: DetAttributes): ProdBuilder<S>;
}

export interface ProdBuilder<S extends Schema> {
  prod(payload: Prod): ImpostoBuilder<S> & IcmsOrIssQnBuilder<S>;
}

export interface ImpostoBuilder<S extends Schema> {
  imposto(payload: Imposto): IcmsOrIssQnBuilder<S> & AssembleDetXmlBuilder;
}

export interface IcmsBuilder<S extends Schema> {
  icms(
    payload?: ICMS,
  ): IcmsIpiBuilder<S> &
    IIBuilder<S> &
    PisBuilder<S> &
    PisStBuilder<S> &
    CofinsBuilder<S> &
    CofinsStBuilder<S> &
    IcmsufdestBuilder<S> &
    IsBuilder<S> &
    IbscbsBuilder<S> &
    VItemBuilder<S> &
    DFeReferenciadoBuilder<S> &
    AssembleDetXmlBuilder &
    IssQnBuilder<S>;
}

export interface IssQnBuilder<S extends Schema> {
  issqn(
    payload?: ISSQN,
  ): IssIpiBuilder<S> &
    PisBuilder<S> &
    PisStBuilder<S> &
    CofinsBuilder<S> &
    CofinsStBuilder<S> &
    IcmsufdestBuilder<S> &
    IsBuilder<S> &
    IbscbsBuilder<S> &
    VItemBuilder<S> &
    DFeReferenciadoBuilder<S> &
    AssembleDetXmlBuilder &
    IcmsBuilder<S>;
}

export interface IcmsOrIssQnBuilder<S extends Schema>
  extends IcmsBuilder<S>, IssQnBuilder<S> {}

export interface OptionalSharedImpostoBuilder<S extends Schema>
  extends
    PisBuilder<S>,
    CofinsBuilder<S>,
    IcmsufdestBuilder<S>,
    IsBuilder<S>,
    IbscbsBuilder<S>,
    VItemBuilder<S>,
    DFeReferenciadoBuilder<S>,
    AssembleDetXmlBuilder {}

export interface IcmsIpiBuilder<S extends Schema> {
  ipi(
    payload: IPI,
  ): IIBuilder<S> &
    PisBuilder<S> &
    PisStBuilder<S> &
    IcmsufdestBuilder<S> &
    IsBuilder<S> &
    IbscbsBuilder<S> &
    VItemBuilder<S> &
    DFeReferenciadoBuilder<S> &
    AssembleDetXmlBuilder;
}

export interface IssIpiBuilder<S extends Schema> {
  ipi(
    payload: IPI,
  ): PisBuilder<S> &
    PisStBuilder<S> &
    IcmsufdestBuilder<S> &
    IsBuilder<S> &
    IbscbsBuilder<S> &
    VItemBuilder<S> &
    DFeReferenciadoBuilder<S> &
    AssembleDetXmlBuilder;
}

export interface IIBuilder<S extends Schema> {
  ii(
    payload: II,
  ): PisBuilder<S> &
    PisStBuilder<S> &
    IcmsufdestBuilder<S> &
    IsBuilder<S> &
    IbscbsBuilder<S> &
    VItemBuilder<S> &
    DFeReferenciadoBuilder<S> &
    AssembleDetXmlBuilder;
}

export interface PisBuilder<S extends Schema> {
  pis(
    payload: PIS,
  ): PisStBuilder<S> &
    CofinsBuilder<S> &
    CofinsStBuilder<S> &
    IcmsufdestBuilder<S> &
    IsBuilder<S> &
    IbscbsBuilder<S> &
    VItemBuilder<S> &
    DFeReferenciadoBuilder<S> &
    AssembleDetXmlBuilder;
}

export interface PisStBuilder<S extends Schema> {
  pisst(
    payload: PISST,
  ): CofinsBuilder<S> &
    CofinsStBuilder<S> &
    IcmsufdestBuilder<S> &
    IsBuilder<S> &
    IbscbsBuilder<S> &
    VItemBuilder<S> &
    DFeReferenciadoBuilder<S> &
    AssembleDetXmlBuilder;
}

export interface CofinsBuilder<S extends Schema> {
  cofins(
    payload: COFINS,
  ): CofinsStBuilder<S> &
    IcmsufdestBuilder<S> &
    IsBuilder<S> &
    IbscbsBuilder<S> &
    VItemBuilder<S> &
    DFeReferenciadoBuilder<S> &
    AssembleDetXmlBuilder;
}

export interface CofinsStBuilder<S extends Schema> {
  cofinsst(
    payload: COFINSST,
  ): IcmsufdestBuilder<S> &
    IsBuilder<S> &
    IbscbsBuilder<S> &
    VItemBuilder<S> &
    DFeReferenciadoBuilder<S> &
    AssembleDetXmlBuilder;
}

export interface IcmsufdestBuilder<S extends Schema> {
  icmsufdest(
    payload: ICMSUFDest,
  ): IsBuilder<S> &
    IbscbsBuilder<S> &
    VItemBuilder<S> &
    DFeReferenciadoBuilder<S> &
    AssembleDetXmlBuilder;
}

/** IS → IBSCBS → vItem → DFeReferenciado */
export interface IsBuilder<S extends Schema> {
  is(
    payload?: IS,
  ): IbscbsBuilder<S> &
    VItemBuilder<S> &
    DFeReferenciadoBuilder<S> &
    AssembleDetXmlBuilder;
}

export interface IbscbsBuilder<S extends Schema> {
  ibscbs(
    payload?: IBSCBS,
  ): VItemBuilder<S> & DFeReferenciadoBuilder<S> & AssembleDetXmlBuilder;
}

export interface VItemBuilder<S extends Schema> {
  vItem(payload: VItem): DFeReferenciadoBuilder<S> & AssembleDetXmlBuilder;
}

export interface DFeReferenciadoBuilder<_S extends Schema> {
  dfeReferenciado(payload: DFeReferenciado): AssembleDetXmlBuilder;
}

export interface AssembleDetXmlBuilder {
  assemble(): Det;
}

export interface INfeDetXmlBuilder<S extends Schema>
  extends
    DetBuilder<S>,
    ProdBuilder<S>,
    ImpostoBuilder<S>,
    IcmsOrIssQnBuilder<S>,
    OptionalSharedImpostoBuilder<S>,
    IsBuilder<S>,
    IbscbsBuilder<S>,
    VItemBuilder<S>,
    DFeReferenciadoBuilder<S>,
    AssembleDetXmlBuilder {}
