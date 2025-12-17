import { type XmlToolkit, Environment, NFeTsError } from '@nfets/core/domain';
import { type DeepPartial, left, right } from '@nfets/core/shared';
import { ValidateErrorsMetadata, Validates } from '@nfets/core/application';

import type { InfNFeAttributes as IInfNFeAttributes } from '@nfets/nfe/domain/entities/nfe/inf-nfe';
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
  TotalBuilder,
  TranspBuilder,
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
import { ContingencyOptions } from '@nfets/nfe/domain/entities/transmission/nfe-remote-client';
import { TpEmis } from '@nfets/nfe/domain/entities/constants/tp-emis';
import webservices from '@nfets/nfe/services/contingency-webservices-mod55';

export class NfeXmlBuilder<T extends object = INFe>
  implements INfeXmlBuilder<T>
{
  protected readonly data = {
    $: { xmlns: 'http://www.portalfiscal.inf.br/nfe' },
    infNFe: {
      total: { ICMSTot: {} },
    },
  } as const as INFe;

  private $data: T | undefined = void 0;

  protected get entity(): new () => T {
    return NFe as new () => T;
  }

  protected readonly root = 'NFe';

  protected readonly $det: DetBuilderAggregator | undefined =
    new DefaultDetBuilderAggregator(this);
  protected readonly $total: TotalBuilderAggregator | undefined =
    new DefaultTotalBuilderAggregator(this);

  protected readonly nfeDetXmlBuilder = NfeDetXmlBuilder.create(this.$det);

  public static create<T extends object = INFe>(
    builder: XmlToolkit,
    contingency?: ContingencyOptions,
  ): InfNFeBuilder<T> & IdeBuilder<T> {
    return new this(builder, contingency);
  }

  protected constructor(
    protected readonly builder: XmlToolkit,
    protected contingency?: ContingencyOptions,
  ) {}

  @Validates(InfNFeAttributes)
  public infNFe($: IInfNFeAttributes) {
    this.data.infNFe.$ = $;
    return this;
  }

  @Validates(Ide)
  public ide(payload: IIde) {
    this.data.infNFe.ide = payload;
    return this;
  }

  @Validates(Emit)
  public emit(payload: IEmit) {
    this.data.infNFe.emit = payload;
    return this;
  }

  @Validates(Avulsa)
  public avulsa(payload: IAvulsa) {
    this.data.infNFe.avulsa = payload;
    return this;
  }

  @Validates(Dest)
  public dest(payload: IDest) {
    this.data.infNFe.dest = payload;
    return this;
  }

  @Validates(Local)
  public retirada(payload: ILocal) {
    this.data.infNFe.retirada = payload;
    return this;
  }

  @Validates(Local)
  public entrega(payload: ILocal) {
    this.data.infNFe.entrega = payload;
    return this;
  }

  @Validates(AutXML)
  public autXML(payload: IAutXML) {
    this.data.infNFe.autXML ??= [] as IAutXML[];
    this.data.infNFe.autXML.push(payload);
    return this;
  }

  public det<D>(
    items: [D, ...D[]],
    build: (ctx: ProdBuilder, item: D) => AssembleDetXmlBuilder,
  ): TotalBuilder<T> & TranspBuilder<T> {
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
    this.data.infNFe.total = payload;
    return this;
  }

  public increment(
    callback: (context: DeepPartial<ITotal>) => DeepPartial<ITotal>,
  ) {
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
    this.data.infNFe.transp = payload;
    return this;
  }

  @Validates(Cobr)
  public cobr(payload: ICobr) {
    this.data.infNFe.cobr = payload;
    return this;
  }

  @Validates(Pag)
  public pag(payload: IPag) {
    this.data.infNFe.pag = payload;
    return this;
  }

  @Validates(InfIntermed)
  public infIntermed(payload: IInfIntermed) {
    this.data.infNFe.infIntermed = payload;
    return this;
  }

  @Validates(InfAdic)
  public infAdic(payload: IInfAdic) {
    this.data.infNFe.infAdic = payload;
    return this;
  }

  @Validates(Exporta)
  public exporta(payload: IExporta) {
    this.data.infNFe.exporta = payload;
    return this;
  }

  @Validates(Compra)
  public compra(payload: ICompra) {
    this.data.infNFe.compra = payload;
    return this;
  }

  @Validates(Cana)
  public cana(payload: ICana) {
    this.data.infNFe.cana = payload;
    return this;
  }

  @Validates(InfRespTec)
  public infRespTec(payload: IInfRespTec) {
    this.data.infNFe.infRespTec = payload;
    return this;
  }

  @Validates(InfSolicNFF)
  public infSolicNFF(payload: ISolicNFF) {
    this.data.infNFe.infSolicNFF = payload;
    return this;
  }

  public quiet() {
    Reflect.deleteMetadata(ValidateErrorsMetadata, this);
    return this;
  }

  public toObject() {
    if (this.$data !== void 0) return right(this.$data);
    const errors = this.errors();
    if (errors) return left(new NFeTsError(errors.join(', ')));
    this.$total?.aggregate();
    this.assertHomologValidations();
    this.assertContingencyModes();
    this.fillAccessKeyIfEmpty();
    this.$data = plainToInstance<T>(this.data, this.entity, {
      clearEmptyValues: true,
    });
    return right(this.$data);
  }

  /** @throws {NFeTsError} */
  public async assemble() {
    const resultOrLeft = this.toObject();
    if (resultOrLeft.isLeft()) return resultOrLeft;
    return right(
      await this.builder.build(resultOrLeft.value, { rootName: this.root }),
    );
  }

  protected assertHomologValidations(): boolean {
    if (this.data.infNFe.ide.tpAmb !== Environment.Homolog) return false;

    if (this.data.infNFe.dest)
      this.data.infNFe.dest.xNome =
        'NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL' as const;

    return true;
  }

  protected assertContingencyModes(): void {
    if (this.contingency === void 0) {
      return this.automaticallyInferContingencyMode();
    }

    this.data.infNFe.ide.dhCont ??= this.contingency.dhCont;
    this.data.infNFe.ide.xJust ??= this.contingency.xJust;

    const { cUF, tpEmis } = this.data.infNFe.ide;
    if (tpEmis !== TpEmis.Normal) return;

    const contingency = webservices[cUF];
    switch (contingency) {
      case 'SVCAN':
        return (this.data.infNFe.ide.tpEmis = TpEmis.SVCAN), void 0;
      case 'SVCRS':
        return (this.data.infNFe.ide.tpEmis = TpEmis.SVCRS), void 0;
    }
  }

  protected automaticallyInferContingencyMode(): void {
    const { xJust, dhCont, tpEmis } = this.data.infNFe.ide;
    if (!xJust && !dhCont && tpEmis === TpEmis.Normal) return;

    this.contingency = {
      xJust: xJust ?? 'SEFAZ fora do Ar',
      dhCont: dhCont ?? new Date().toISOString(),
    } satisfies ContingencyOptions;

    return this.assertContingencyModes();
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
    if (this.data.infNFe.$.Id) return;

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

    this.data.infNFe.ide.cDV = Id.slice(-1);
    this.data.infNFe.$ = {
      Id: `${this.root}${Id}`,
      versao: this.data.infNFe.$.versao,
    };
  }
}
