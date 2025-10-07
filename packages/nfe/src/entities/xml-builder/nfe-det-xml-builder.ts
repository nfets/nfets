import type { Det, DetAttributes } from '@nfets/nfe/entities/nfe/inf-nfe/det';
import type { Imposto } from '@nfets/nfe/entities/nfe/inf-nfe/det/imposto';
import type {
  COFINS,
  COFINSST,
} from '@nfets/nfe/entities/nfe/inf-nfe/det/imposto/cofins';
import type { ICMS } from '@nfets/nfe/entities/nfe/inf-nfe/det/imposto/icms';
import type { ICMSUFDest } from '@nfets/nfe/entities/nfe/inf-nfe/det/imposto/icmsufdest';
import type { II } from '@nfets/nfe/entities/nfe/inf-nfe/det/imposto/ii';
import type { IPI } from '@nfets/nfe/entities/nfe/inf-nfe/det/imposto/ipi';
import type { ISSQN } from '@nfets/nfe/entities/nfe/inf-nfe/det/imposto/issqn';
import type {
  PIS,
  PISST,
} from '@nfets/nfe/entities/nfe/inf-nfe/det/imposto/pis';
import type { Prod } from '@nfets/nfe/entities/nfe/inf-nfe/det/prod';

export interface DetBuilder {
  det($: DetAttributes): ProdBuilder;
}

export interface ProdBuilder {
  prod(payload: Prod): ImpostoBuilder & IcmsOrIssQnBuilder;
}

export interface ImpostoBuilder {
  imposto(payload: Imposto): IcmsOrIssQnBuilder & AssembleDetXmlBuilder;
}

export interface IcmsBuilder {
  icms(
    payload: ICMS,
  ): IcmsIpiBuilder &
    IIBuilder &
    PisBuilder &
    PisStBuilder &
    CofinsBuilder &
    CofinsStBuilder &
    AssembleDetXmlBuilder;
}

export interface IssQnBuilder {
  issqn(
    payload: ISSQN,
  ): IssIpiBuilder & PisBuilder & PisStBuilder & AssembleDetXmlBuilder;
}

export interface IcmsOrIssQnBuilder extends IcmsBuilder, IssQnBuilder {}

export interface OptionalSharedImpostoBuilder
  extends PisBuilder,
    CofinsBuilder,
    IcmsufdestBuilder,
    AssembleDetXmlBuilder {}

export interface IcmsIpiBuilder {
  ipi(
    payload: IPI,
  ): IIBuilder &
    PisBuilder &
    PisStBuilder &
    IcmsufdestBuilder &
    AssembleDetXmlBuilder;
}

export interface IssIpiBuilder {
  ipi(
    payload: IPI,
  ): PisBuilder & PisStBuilder & IcmsufdestBuilder & AssembleDetXmlBuilder;
}

export interface IIBuilder {
  ii(
    payload: II,
  ): PisBuilder & PisStBuilder & IcmsufdestBuilder & AssembleDetXmlBuilder;
}

export interface PisBuilder {
  pis(
    payload: PIS,
  ): IcmsufdestBuilder &
    CofinsBuilder &
    CofinsStBuilder &
    PisStBuilder &
    AssembleDetXmlBuilder;
}

export interface PisStBuilder {
  pisst(
    payload: PISST,
  ): IcmsufdestBuilder &
    CofinsBuilder &
    CofinsStBuilder &
    AssembleDetXmlBuilder;
}

export interface CofinsBuilder {
  cofins(
    payload: COFINS,
  ): IcmsufdestBuilder & CofinsStBuilder & AssembleDetXmlBuilder;
}

export interface CofinsStBuilder {
  cofinsst(payload: COFINSST): IcmsufdestBuilder & AssembleDetXmlBuilder;
}

export interface IcmsufdestBuilder {
  icmsufdest(payload: ICMSUFDest): AssembleDetXmlBuilder;
}

export interface AssembleDetXmlBuilder {
  assemble(): Det;
}

export interface INfeDetXmlBuilder
  extends DetBuilder,
    ProdBuilder,
    ImpostoBuilder,
    IcmsOrIssQnBuilder,
    OptionalSharedImpostoBuilder,
    AssembleDetXmlBuilder {}
