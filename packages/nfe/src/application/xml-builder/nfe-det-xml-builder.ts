import { Validates } from '@nfets/core/application';

import type {
  Det as IDet,
  DetAttributes as IDetAttributes,
} from '@nfets/nfe/domain/entities/nfe/inf-nfe/det';
import type { Prod as IProd } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/prod';
import type { Imposto as IImposto } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto';
import type {
  PIS as IPIS,
  PISST as IPISST,
} from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/pis';
import type {
  COFINSST as ICOFINSST,
  COFINS as ICOFINS,
} from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/cofins';
import type { ICMS as IICMS } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/icms';
import type { ISSQN as IISSQN } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/issqn';
import type { IPI as IIPI } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ipi';
import type { ICMSUFDest as IICMSUFDest } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/icmsufdest';
import type { II as III } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ii';

import {
  DetBuilder,
  ProdBuilder,
  INfeDetXmlBuilder,
} from '@nfets/nfe/domain/entities/xml-builder/nfe-det-xml-builder';

import { Prod } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/prod';
import { DetAttributes } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det';
import { Imposto } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto';
import { IPI } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/ipi';
import { ICMS } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/icms';
import { ISSQN } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/issqn';
import {
  PIS,
  PISST,
} from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/pis';
import {
  COFINS,
  COFINSST,
} from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/cofins';
import { ICMSUFDest } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/icmsufdest';
import { II } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/ii';
import { DetBuilderAggregator } from '@nfets/nfe/application/aggregator/det-builder-aggregator';
import {
  IBSCBS,
  IBSCBS as IIBSCBS,
} from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/ibscbs';
import { IS, IS as IIS } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/det/imposto/is';
import Schemas from '@nfets/nfe/domain/entities/transmission/schemas';
import { Schema } from '@nfets/nfe/domain';

export class NfeDetXmlBuilder implements INfeDetXmlBuilder {
  protected data = {} as IDet;

  public static create(
    listener?: DetBuilderAggregator,
    schema: Schema = 'PL_009_V4',
  ): DetBuilder & ProdBuilder {
    return new this(listener, schema);
  }

  protected constructor(
    private readonly listener?: DetBuilderAggregator,
    private readonly schema: Schema = 'PL_009_V4',
  ) {}

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
  private setImposto(payload: IImposto): IImposto {
    this.data.imposto = payload;
    return payload;
  }

  public imposto(payload: IImposto) {
    this.listener?.imposto(this.setImposto(payload));
    return this;
  }

  @Validates(ICMS)
  public icms(payload?: IICMS) {
    if (!payload) return this;
    this.data.imposto ??= {} as IImposto;
    this.data.imposto.ICMS = payload;
    this.listener?.icms(payload);
    return this;
  }

  @Validates(ISSQN)
  public issqn(payload?: IISSQN) {
    if (!payload) return this;
    this.data.imposto ??= {} as IImposto;
    this.data.imposto.ISSQN = payload;
    this.listener?.issqn(payload);
    return this;
  }

  @Validates(II)
  public ii(payload: III) {
    this.data.imposto ??= {} as IImposto;
    this.data.imposto.II = payload;
    this.listener?.ii(payload);
    return this;
  }

  @Validates(IPI)
  public ipi(payload: IIPI) {
    this.data.imposto ??= {} as IImposto;
    this.data.imposto.IPI = payload;
    this.listener?.ipi(payload);
    return this;
  }

  @Validates(PIS)
  public pis(payload: IPIS) {
    this.data.imposto ??= {} as IImposto;
    this.data.imposto.PIS = payload;
    this.listener?.pis(payload);
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
    this.listener?.cofins(payload);
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

  @Validates(IS)
  public is(payload?: IIS) {
    if (payload == null) return this;
    if (this.schema === Schemas.PL_009_V4) return this;

    this.data.imposto ??= {} as IImposto;
    this.data.imposto.IS = payload;
    return this;
  }

  @Validates(IBSCBS)
  public ibscbs(payload?: IIBSCBS) {
    if (payload == null) return this;
    if (this.schema === Schemas.PL_009_V4) return this;

    this.data.imposto ??= {} as IImposto;
    this.data.imposto.IBSCBS = payload;
    return this;
  }

  public vItem(payload: { vItem: string }) {
    if (this.schema === Schemas.PL_009_V4) return this;

    this.data.vItem = payload.vItem;
    return this;
  }

  public assemble(): IDet {
    if (this.data.imposto) this.setImposto(this.data.imposto);
    const result = { ...this.data };
    this.data = {} as IDet;
    return result;
  }
}
