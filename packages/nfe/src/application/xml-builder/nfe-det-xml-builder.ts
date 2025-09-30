import { Validates } from '../validator/validate';

import type {
  Det as IDet,
  DetAttributes as IDetAttributes,
} from 'src/entities/nfe/inf-nfe/det';
import type { Prod as IProd } from 'src/entities/nfe/inf-nfe/det/prod';
import type { Imposto as IImposto } from 'src/entities/nfe/inf-nfe/det/imposto';
import type {
  PIS as IPIS,
  PISST as IPISST,
} from 'src/entities/nfe/inf-nfe/det/imposto/pis';
import type {
  COFINSST as ICOFINSST,
  COFINS as ICOFINS,
} from 'src/entities/nfe/inf-nfe/det/imposto/cofins';
import type { ICMS as IICMS } from 'src/entities/nfe/inf-nfe/det/imposto/icms';
import type { ISSQN as IISSQN } from 'src/entities/nfe/inf-nfe/det/imposto/issqn';
import type { IPI as IIPI } from 'src/entities/nfe/inf-nfe/det/imposto/ipi';
import type { ICMSUFDest as IICMSUFDest } from 'src/entities/nfe/inf-nfe/det/imposto/icmsufdest';
import type { II as III } from 'src/entities/nfe/inf-nfe/det/imposto/ii';

import {
  DetBuilder,
  ProdBuilder,
  INfeDetXmlBuilder,
} from 'src/entities/xml-builder/nfe-det-xml-builder';

import { Prod } from 'src/dto/inf-nfe/det/prod';
import { DetAttributes } from 'src/dto/inf-nfe/det';
import { Imposto } from 'src/dto/inf-nfe/det/imposto';
import { IPI } from 'src/dto/inf-nfe/det/imposto/ipi';
import { ICMS } from 'src/dto/inf-nfe/det/imposto/icms';
import { ISSQN } from 'src/dto/inf-nfe/det/imposto/issqn';
import { PIS, PISST } from 'src/dto/inf-nfe/det/imposto/pis';
import { COFINS, COFINSST } from 'src/dto/inf-nfe/det/imposto/cofins';
import { ICMSUFDest } from 'src/dto/inf-nfe/det/imposto/icmsufdest';
import { II } from 'src/dto/inf-nfe/det/imposto/ii';
import { DetBuilderListener } from '../listeners/det-builder-listener';

export class NfeDetXmlBuilder implements INfeDetXmlBuilder {
  private readonly data = {} as IDet;

  public static create(
    listener?: DetBuilderListener,
  ): DetBuilder & ProdBuilder {
    return new this(listener);
  }

  protected constructor(private readonly listener?: DetBuilderListener) {}

  @Validates(DetAttributes)
  public det(payload: IDetAttributes) {
    this.data.$ = payload;
    return this;
  }

  @Validates(Prod)
  public prod(payload: IProd) {
    this.data.prod = payload;
    this.listener?.prod(payload);
    return this;
  }

  @Validates(Imposto)
  public imposto(payload: IImposto) {
    this.data.imposto = payload;
    return this;
  }

  @Validates(ICMS)
  public icms(payload: IICMS) {
    this.data.imposto ??= {} as IImposto;
    this.data.imposto.ICMS = payload;
    this.listener?.icms(payload);
    return this;
  }

  @Validates(ISSQN)
  public issqn(payload: IISSQN) {
    this.data.imposto ??= {} as IImposto;
    this.data.imposto.ISSQN = payload;
    return this;
  }

  @Validates(II)
  public ii(payload: III) {
    this.data.imposto ??= {} as IImposto;
    this.data.imposto.II = payload;
    return this;
  }

  @Validates(IPI)
  public ipi(payload: IIPI) {
    this.data.imposto ??= {} as IImposto;
    this.data.imposto.IPI = payload;
    return this;
  }

  @Validates(PIS)
  public pis(payload: IPIS) {
    this.data.imposto ??= {} as IImposto;
    this.data.imposto.PIS = payload;
    return this;
  }

  @Validates(PISST)
  public pisst(payload: IPISST) {
    this.data.imposto ??= {} as IImposto;
    this.data.imposto.PISST = payload;
    return this;
  }

  @Validates(COFINS)
  public cofins(payload: ICOFINS) {
    this.data.imposto ??= {} as IImposto;
    this.data.imposto.COFINS = payload;
    return this;
  }

  @Validates(COFINSST)
  public cofinsst(payload: ICOFINSST) {
    this.data.imposto ??= {} as IImposto;
    this.data.imposto.COFINSST = payload;
    return this;
  }

  @Validates(ICMSUFDest)
  public icmsufdest(payload: IICMSUFDest) {
    this.data.imposto ??= {} as IImposto;
    this.data.imposto.ICMSUFDest = payload;
    return this;
  }

  public assemble(): IDet {
    if (this.data.imposto) this.imposto(this.data.imposto);
    return this.data;
  }
}
