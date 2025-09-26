import { NFeTsError, XmlBuilder } from '@nfets/core';

import type {
  InfNFeAttributes as IInfNFeAttributes,
  InfNFe as IInfNFe,
} from 'src/entities/nfe/inf-nfe';
import type { Ide as IIde } from 'src/entities/nfe/inf-nfe/ide';
import type { Emit as IEmit } from 'src/entities/nfe/inf-nfe/emit';
import type { Det as IDet } from 'src/entities/nfe/inf-nfe/det';
import type { Pag as IPag } from 'src/entities/nfe/inf-nfe/pag';

import type { NFeBuilder } from 'src/entities/xml-builder/nfe';
import type { IdeBuilder } from 'src/entities/xml-builder/inf-nfe/ide-builder';
import type { EmitBuilder } from 'src/entities/xml-builder/inf-nfe/emit-builder';
import type { DetBuilder } from 'src/entities/xml-builder/inf-nfe/det-builder';
import type { PagBuilder } from 'src/entities/xml-builder/inf-nfe/pag-builder';
import type {
  AssembleNfeBuilder,
  InfNFeBuilder,
} from 'src/entities/xml-builder/inf-nfe';
import type { NFe } from 'src/entities/nfe/nfe';

import { ValidateErrorsMetadata, Validates } from '../validator/validate';
import { InfNFeAttributes } from 'src/dto/inf-nfe/inf-nfe';
import { Ide } from 'src/dto/inf-nfe/ide';
import { Emit } from 'src/dto/inf-nfe/emit';
import { AccessKeyBuider } from '../access-key/access-key-builder';

export class NfeXmlBuilder implements NFeBuilder {
  public static create(builder: XmlBuilder): InfNFeBuilder & IdeBuilder {
    return new this(builder);
  }

  protected constructor(
    private readonly builder: XmlBuilder,
    private readonly data: NFe = {
      $: { xmlns: 'http://www.portalfiscal.inf.br/nfe' },
    } as NFe,
  ) {}

  @Validates(InfNFeAttributes)
  public infNFe($: IInfNFeAttributes): IdeBuilder {
    this.data.infNFe = { $ } as IInfNFe;
    return this;
  }

  @Validates(Ide)
  public ide(payload: IIde): EmitBuilder {
    this.data.infNFe.ide = payload;
    return this;
  }

  @Validates(Emit)
  public emit(payload: IEmit): DetBuilder {
    this.data.infNFe.emit = payload;

    if (!this.data.infNFe.$.Id) {
      this.data.infNFe.$ = {
        Id: new AccessKeyBuider().compile({
          cUF: this.data.infNFe.ide.cUF,
          year: this.data.infNFe.ide.dhEmi.substring(2, 4),
          month: this.data.infNFe.ide.dhEmi.substring(5, 7),
          identification:
            this.data.infNFe.emit.CPF ?? this.data.infNFe.emit.CNPJ,
          mod: this.data.infNFe.ide.mod,
          serie: this.data.infNFe.ide.serie,
          nNF: this.data.infNFe.ide.nNF,
          tpEmis: this.data.infNFe.ide.tpEmis,
          cNF: this.data.infNFe.ide.cNF,
        }),
        versao: this.data.infNFe.$.versao,
        pk_nItem: this.data.infNFe.$.pk_nItem,
      };
    }

    return this;
  }

  public det(_payload: IDet[]): PagBuilder {
    return this;
  }

  public pag(_payload: IPag): AssembleNfeBuilder {
    return this;
  }

  public quiet(): AssembleNfeBuilder {
    Reflect.deleteMetadata(ValidateErrorsMetadata, this);
    return this;
  }

  /** @throws {NFeTsError} */
  public assemble(): Promise<string> {
    const errors = Reflect.getMetadata(ValidateErrorsMetadata, this) as
      | string[]
      | undefined;

    if (errors) throw new NFeTsError(errors.join(', '));
    return this.builder.build(this.data, { rootName: 'NFe' });
  }
}
