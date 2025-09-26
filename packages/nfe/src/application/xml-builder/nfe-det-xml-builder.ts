import { Validates } from '../validator/validate';

import type {
  Det as IDet,
  DetAttributes as IDetAttributes,
} from 'src/entities/nfe/inf-nfe/det';
import type { Prod as IProd } from 'src/entities/nfe/inf-nfe/det/prod';

import { Prod } from 'src/dto/inf-nfe/det/prod';
import { DetAttributes } from 'src/dto/inf-nfe/det';
import {
  DetBuilder,
  ProdBuilder,
  INfeDetXmlBuilder,
} from 'src/entities/xml-builder/nfe-det-xml-builder';

export class NfeDetXmlBuilder implements INfeDetXmlBuilder {
  private readonly data = {} as IDet;

  public static create(): DetBuilder & ProdBuilder {
    return new this();
  }

  @Validates(DetAttributes)
  public det(payload: IDetAttributes) {
    this.data.$ = payload;
    return this;
  }

  @Validates(Prod)
  public prod(payload: IProd) {
    this.data.prod = payload;
    return this;
  }

  public assemble(): IDet {
    return this.data;
  }
}
