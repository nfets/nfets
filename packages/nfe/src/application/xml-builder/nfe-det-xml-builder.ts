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

export class NfeDetXmlBuilder implements INfeDetXmlBuilder {
  protected readonly data = {} as IDet;

  public static create(
    listener?: DetBuilderAggregator,
  ): DetBuilder & ProdBuilder {
    return new this(listener);
  }

  protected constructor(private readonly listener?: DetBuilderAggregator) {}

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
