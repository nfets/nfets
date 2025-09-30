import { NFeTsError, XmlBuilder } from '@nfets/core';

import type {
  InfNFeAttributes as IInfNFeAttributes,
  InfNFe as IInfNFe,
} from 'src/entities/nfe/inf-nfe';
import type { Ide as IIde } from 'src/entities/nfe/inf-nfe/ide';
import type { Emit as IEmit } from 'src/entities/nfe/inf-nfe/emit';
import type { Pag as IPag } from 'src/entities/nfe/inf-nfe/pag';
import type { Transp as ITransp } from 'src/entities/nfe/inf-nfe/transp';
import type { Total as ITotal } from 'src/entities/nfe/inf-nfe/total';

import type {
  INfeXmlBuilder,
  InfNFeBuilder,
  IdeBuilder,
  EmitBuilder,
  DetBuilder,
  PagBuilder,
  AssembleNfeBuilder,
  TranspBuilder,
  TotalBuilder,
} from 'src/entities/xml-builder/nfe-xml-builder';
import type { NFe as INFe } from 'src/entities/nfe/nfe';

import { ValidateErrorsMetadata, Validates } from '../validator/validate';

import { NFe } from 'src/dto/nfe';
import { InfNFeAttributes } from 'src/dto/inf-nfe/inf-nfe';
import { Ide } from 'src/dto/inf-nfe/ide';
import { Emit } from 'src/dto/inf-nfe/emit';
import { Total } from 'src/dto/inf-nfe/total';
import { Pag } from 'src/dto/inf-nfe/pag';
import { Transp } from 'src/dto/inf-nfe/transp';
import { AccessKeyBuider } from '../access-key/access-key-builder';
import {
  AssembleDetXmlBuilder,
  ProdBuilder,
} from 'src/entities/xml-builder/nfe-det-xml-builder';
import { NfeDetXmlBuilder } from './nfe-det-xml-builder';

import {
  DefaultDetBuilderListener,
  type DetBuilderListener,
} from '../listeners/det-builder-listener';
import { plainToInstance } from '../transforms/plain-to-instance';

export class NfeXmlBuilder implements INfeXmlBuilder {
  private readonly data = {
    $: { xmlns: 'http://www.portalfiscal.inf.br/nfe' },
    infNFe: {
      total: { ICMSTot: {} },
    },
  } as Partial<INFe>;

  protected readonly $det: DetBuilderListener | undefined =
    new DefaultDetBuilderListener(this);

  protected readonly nfeDetXmlBuilder = NfeDetXmlBuilder.create(this.$det);

  public static create(builder: XmlBuilder): InfNFeBuilder & IdeBuilder {
    return new this(builder);
  }

  protected constructor(private readonly builder: XmlBuilder) {}

  @Validates(InfNFeAttributes)
  public infNFe($: IInfNFeAttributes): IdeBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.$ = $;
    return this;
  }

  @Validates(Ide)
  public ide(payload: IIde): EmitBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.ide = payload;
    return this;
  }

  @Validates(Emit)
  public emit(payload: IEmit): DetBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.emit = payload;
    this.fillAccessKeyIfEmpty();
    return this;
  }

  public det<T>(
    items: T[],
    build: (ctx: ProdBuilder, item: T) => AssembleDetXmlBuilder,
  ): PagBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.det = items.map((item, index) =>
      build(
        this.nfeDetXmlBuilder.det({ nItem: (index + 1).toString() }),
        item,
      ).assemble(),
    );
    return this;
  }

  @Validates(Total)
  public total(payload: ITotal): TranspBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.total = payload;
    return this;
  }

  public increment(
    callback: (context: ITotal) => Partial<ITotal>,
  ): TranspBuilder & TotalBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.total = {
      ...this.data.infNFe.total,
      ...callback(this.data.infNFe.total),
    };

    return this;
  }

  @Validates(Transp)
  public transp(payload: ITransp): PagBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.transp = payload;
    return this;
  }

  @Validates(Pag)
  public pag(payload: IPag): AssembleNfeBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.pag = payload;
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
    return this.builder.build(plainToInstance(this.data, NFe), {
      rootName: 'NFe',
    });
  }

  private fillAccessKeyIfEmpty(): void {
    if (this.data.infNFe?.$.Id) return;

    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.$ = {
      Id: new AccessKeyBuider().compile({
        cUF: this.data.infNFe.ide.cUF,
        year: this.data.infNFe.ide.dhEmi.substring(2, 4),
        month: this.data.infNFe.ide.dhEmi.substring(5, 7),
        identification: this.data.infNFe.emit.CPF ?? this.data.infNFe.emit.CNPJ,
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
}
