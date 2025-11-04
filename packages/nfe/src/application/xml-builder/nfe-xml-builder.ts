import { type XmlToolkit, NFeTsError } from '@nfets/core/domain';
import { type DeepPartial, left, right } from '@nfets/core/shared';
import { ValidateErrorsMetadata, Validates } from '@nfets/core/application';

import type {
  InfNFeAttributes as IInfNFeAttributes,
  InfNFe as IInfNFe,
} from '@nfets/nfe/domain/entities/nfe/inf-nfe';
import type { Ide as IIde } from '@nfets/nfe/domain/entities/nfe/inf-nfe/ide';
import type { Cobr as ICobr } from '@nfets/nfe/domain/entities/nfe/inf-nfe/cobr';
import type { Emit as IEmit } from '@nfets/nfe/domain/entities/nfe/inf-nfe/emit';
import type { Pag as IPag } from '@nfets/nfe/domain/entities/nfe/inf-nfe/pag';
import type { Transp as ITransp } from '@nfets/nfe/domain/entities/nfe/inf-nfe/transp';
import type { Total as ITotal } from '@nfets/nfe/domain/entities/nfe/inf-nfe/total';
import type { Det as IDet } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det';
import type { InfIntermed as IInfIntermed } from '@nfets/nfe/domain/entities/nfe/inf-nfe/infintermed';
import type { Exporta as IExporta } from '@nfets/nfe/domain/entities/nfe/inf-nfe/exporta';
import type { Compra as ICompra } from '@nfets/nfe/domain/entities/nfe/inf-nfe/compra';
import type { Cana as ICana } from '@nfets/nfe/domain/entities/nfe/inf-nfe/cana';
import type { InfRespTec as IInfRespTec } from '@nfets/nfe/domain/entities/nfe/inf-nfe/infresptec';
import type { InfSolicNFF as ISolicNFF } from '@nfets/nfe/domain/entities/nfe/inf-nfe/inf-solic-nff';
import type { InfAdic as IInfAdic } from '@nfets/nfe/domain/entities/nfe/inf-nfe/infadic';
import type { Avulsa as IAvulsa } from '@nfets/nfe/domain/entities/nfe/inf-nfe/avulsa';
import type { AutXML as IAutXML } from '@nfets/nfe/domain/entities/nfe/inf-nfe/autxml';
import type { Local as ILocal } from '@nfets/nfe/domain/entities/nfe/inf-nfe/local';
import type { Dest as IDest } from '@nfets/nfe/domain/entities/nfe/inf-nfe/dest';

import type {
  INfeXmlBuilder,
  InfNFeBuilder,
  IdeBuilder,
} from '@nfets/nfe/domain/entities/xml-builder/nfe-xml-builder';
import type { NFe as INFe } from '@nfets/nfe/domain/entities/nfe/nfe';

import { NFe } from '@nfets/nfe/infrastructure/dto/nfe/nfe';
import { InfNFeAttributes } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/inf-nfe';
import { Ide } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/ide';
import { Emit } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/emit';
import { Total } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/total';
import { Pag } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/pag';
import { Transp } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/transp';
import { AccessKeyBuilder } from '@nfets/nfe/application/access-key/access-key-builder';
import {
  AssembleDetXmlBuilder,
  ProdBuilder,
} from '@nfets/nfe/domain/entities/xml-builder/nfe-det-xml-builder';
import { NfeDetXmlBuilder } from '@nfets/nfe/application/xml-builder/nfe-det-xml-builder';

import {
  DefaultDetBuilderAggregator,
  type DetBuilderAggregator,
} from '@nfets/nfe/application/aggregator/det-builder-aggregator';
import { plainToInstance } from '@nfets/core/application/validations/transformers/plain-to-instance';
import {
  DefaultTotalBuilderAggregator,
  type TotalBuilderAggregator,
} from '@nfets/nfe/application/aggregator/total-builder-aggregator';
import { Cobr } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/cobr';
import { InfRespTec } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/infresptec';
import { InfSolicNFF } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/inf-solic-nff';
import { Avulsa } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/avulsa';
import { Dest } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/dest';
import { Local } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/local';
import { AutXML } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/autxml';
import { InfIntermed } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/infintermed';
import { Exporta } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/exporta';
import { Compra } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/compra';
import { InfAdic } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/infadic';
import { Cana } from '@nfets/nfe/infrastructure/dto/nfe/inf-nfe/cana';

export class NfeXmlBuilder implements INfeXmlBuilder {
  private readonly data = {
    $: { xmlns: 'http://www.portalfiscal.inf.br/nfe' },
    infNFe: {
      total: { ICMSTot: {} },
    },
  } as Partial<INFe>;

  protected readonly root = 'NFe';

  protected readonly $det: DetBuilderAggregator | undefined =
    new DefaultDetBuilderAggregator(this);
  protected readonly $total: TotalBuilderAggregator | undefined =
    new DefaultTotalBuilderAggregator(this);

  protected readonly nfeDetXmlBuilder = NfeDetXmlBuilder.create(this.$det);

  public static create(builder: XmlToolkit): InfNFeBuilder & IdeBuilder {
    return new this(builder);
  }

  protected constructor(private readonly builder: XmlToolkit) {}

  @Validates(InfNFeAttributes)
  public infNFe($: IInfNFeAttributes) {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.$ = $;
    return this;
  }

  @Validates(Ide)
  public ide(payload: IIde) {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.ide = payload;
    return this;
  }

  @Validates(Emit)
  public emit(payload: IEmit) {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.emit = payload;
    this.fillAccessKeyIfEmpty();
    return this;
  }

  @Validates(Avulsa)
  public avulsa(payload: IAvulsa) {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.avulsa = payload;
    return this;
  }

  @Validates(Dest)
  public dest(payload: IDest) {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.dest = payload;
    return this;
  }

  @Validates(Local)
  public retirada(payload: ILocal) {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.retirada = payload;
    return this;
  }

  @Validates(Local)
  public entrega(payload: ILocal) {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.entrega = payload;
    return this;
  }

  @Validates(AutXML)
  public autXML(payload: IAutXML) {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.autXML ??= [] as IAutXML[];
    this.data.infNFe.autXML.push(payload);
    return this;
  }

  public det<T>(
    items: [T, ...T[]],
    build: (ctx: ProdBuilder, item: T) => AssembleDetXmlBuilder,
  ) {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.det = items.map((item, index) => {
      const builder = build(
        this.nfeDetXmlBuilder.det({ nItem: (index + 1).toString() }),
        item,
      );
      return this.collect(builder), builder.assemble();
    }) as [IDet, ...IDet[]];
    return this;
  }

  @Validates(Total)
  public total(payload: ITotal) {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.total = payload;
    return this;
  }

  public increment(
    callback: (context: DeepPartial<ITotal>) => DeepPartial<ITotal>,
  ) {
    this.data.infNFe ??= {} as IInfNFe;
    const result = callback(this.data.infNFe.total) as ITotal;

    this.data.infNFe.total = {
      ...this.data.infNFe.total,
      ICMSTot: { ...this.data.infNFe.total.ICMSTot, ...result.ICMSTot },
      ISSQNtot: result.ISSQNtot
        ? { ...this.data.infNFe.total.ISSQNtot, ...result.ISSQNtot }
        : void 0,
    };

    return this;
  }

  @Validates(Transp)
  public transp(payload: ITransp) {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.transp = payload;
    return this;
  }

  @Validates(Cobr)
  public cobr(payload: ICobr) {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.cobr = payload;
    return this;
  }

  @Validates(Pag)
  public pag(payload: IPag) {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.pag = payload;
    return this;
  }

  @Validates(InfIntermed)
  public infIntermed(payload: IInfIntermed) {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.infIntermed = payload;
    return this;
  }

  @Validates(InfAdic)
  public infAdic(payload: IInfAdic) {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.infAdic = payload;
    return this;
  }

  @Validates(Exporta)
  public exporta(payload: IExporta) {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.exporta = payload;
    return this;
  }

  @Validates(Compra)
  public compra(payload: ICompra) {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.compra = payload;
    return this;
  }

  @Validates(Cana)
  public cana(payload: ICana) {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.cana = payload;
    return this;
  }

  @Validates(InfRespTec)
  public infRespTec(payload: IInfRespTec) {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.infRespTec = payload;
    return this;
  }

  @Validates(InfSolicNFF)
  public infSolicNFF(payload: ISolicNFF) {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.infSolicNFF = payload;
    return this;
  }

  public quiet() {
    Reflect.deleteMetadata(ValidateErrorsMetadata, this);
    return this;
  }

  public toObject() {
    const errors = this.errors();
    if (errors) return left(new NFeTsError(errors.join(', ')));
    this.$total?.aggregate();
    return right(plainToInstance(this.data, NFe));
  }

  /** @throws {NFeTsError} */
  public async assemble() {
    const resultOrLeft = this.toObject();
    if (resultOrLeft.isLeft()) return resultOrLeft;
    return right(
      await this.builder.build(resultOrLeft.value, { rootName: this.root }),
    );
  }

  private errors(): string[] | undefined {
    return Reflect.getMetadata(ValidateErrorsMetadata, this) as
      | string[]
      | undefined;
  }

  private collect(target: object): void {
    const errors = Reflect.getMetadata(ValidateErrorsMetadata, target) as
      | string[]
      | undefined;

    if (!errors) return;

    const current = this.errors();
    Reflect.defineMetadata(
      ValidateErrorsMetadata,
      (current ?? []).concat(errors),
      this,
    );
  }

  private fillAccessKeyIfEmpty(): void {
    if (this.data.infNFe?.$.Id) return;

    this.data.infNFe ??= {} as IInfNFe;
    const Id = new AccessKeyBuilder().compile({
      cUF: this.data.infNFe.ide.cUF,
      year: this.data.infNFe.ide.dhEmi.substring(2, 4),
      month: this.data.infNFe.ide.dhEmi.substring(5, 7),
      identification: this.data.infNFe.emit.CPF ?? this.data.infNFe.emit.CNPJ,
      mod: this.data.infNFe.ide.mod,
      serie: this.data.infNFe.ide.serie,
      nNF: this.data.infNFe.ide.nNF,
      tpEmis: this.data.infNFe.ide.tpEmis,
      cNF: this.data.infNFe.ide.cNF,
    });

    this.data.infNFe.$ = {
      Id: `${this.root}${Id}`,
      versao: this.data.infNFe.$.versao,
    };
  }
}
