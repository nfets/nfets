import { DeepPartial, NFeTsError, XmlToolkit } from '@nfets/core';

import type {
  InfNFeAttributes as IInfNFeAttributes,
  InfNFe as IInfNFe,
} from 'src/entities/nfe/inf-nfe';
import type { Ide as IIde } from 'src/entities/nfe/inf-nfe/ide';
import type { Cobr as ICobr } from 'src/entities/nfe/inf-nfe/cobr';
import type { Emit as IEmit } from 'src/entities/nfe/inf-nfe/emit';
import type { Pag as IPag } from 'src/entities/nfe/inf-nfe/pag';
import type { Transp as ITransp } from 'src/entities/nfe/inf-nfe/transp';
import type { Total as ITotal } from 'src/entities/nfe/inf-nfe/total';
import type { Det as IDet } from 'src/entities/nfe/inf-nfe/det';
import type { InfIntermed as IInfIntermed } from 'src/entities/nfe/inf-nfe/infintermed';
import type { Exporta as IExporta } from 'src/entities/nfe/inf-nfe/exporta';
import type { Compra as ICompra } from 'src/entities/nfe/inf-nfe/compra';
import type { Cana as ICana } from 'src/entities/nfe/inf-nfe/cana';
import type { InfRespTec as IInfRespTec } from 'src/entities/nfe/inf-nfe/infresptec';
import type { InfSolicNFF as ISolicNFF } from 'src/entities/nfe/inf-nfe/inf-solic-nff';
import type { InfAdic as IInfAdic } from 'src/entities/nfe/inf-nfe/infadic';
import type { Avulsa as IAvulsa } from 'src/entities/nfe/inf-nfe/avulsa';
import type { AutXML as IAutXML } from 'src/entities/nfe/inf-nfe/autxml';
import type { Local as ILocal } from 'src/entities/nfe/inf-nfe/local';
import type { Dest as IDest } from 'src/entities/nfe/inf-nfe/dest';

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
  CobrBuilder,
  InfAdicBuilder,
  AvulsaBuilder,
  CompraBuilder,
  CanaBuilder,
  InfRespTecBuilder,
  ExportaBuilder,
  InfIntermedBuilder,
  InfSolicNFFBuilder,
  RetiradaBuilder,
  EntregaBuilder,
  DestBuilder,
  AutXMLBuilder,
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
  DefaultDetBuilderAggregator,
  type DetBuilderAggregator,
} from '../aggregator/det-builder-aggregator';
import { plainToInstance } from '../transform/plain-to-instance';
import {
  DefaultTotalBuilderAggregator,
  type TotalBuilderAggregator,
} from '../aggregator/total-builder-aggregator';
import { Cobr } from 'src/dto/inf-nfe/cobr';
import { InfRespTec } from 'src/dto/inf-nfe/infresptec';
import { InfSolicNFF } from 'src/dto/inf-nfe/inf-solic-nff';
import { Avulsa } from 'src/dto/inf-nfe/avulsa';
import { Dest } from 'src/dto/inf-nfe/dest';
import { Local } from 'src/dto/inf-nfe/local';
import { AutXML } from 'src/dto/inf-nfe/autxml';
import { InfIntermed } from 'src/dto/inf-nfe/infintermed';
import { Exporta } from 'src/dto/inf-nfe/exporta';
import { Compra } from 'src/dto/inf-nfe/compra';
import { InfAdic } from 'src/dto/inf-nfe/infadic';
import { Cana } from 'src/dto/inf-nfe/cana';

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
  public infNFe($: IInfNFeAttributes): IdeBuilder & InfNFeBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.$ = $;
    return this;
  }

  @Validates(Ide)
  public ide(payload: IIde): EmitBuilder & InfNFeBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.ide = payload;
    return this;
  }

  @Validates(Emit)
  public emit(
    payload: IEmit,
  ): AvulsaBuilder &
    DestBuilder &
    RetiradaBuilder &
    EntregaBuilder &
    AutXMLBuilder &
    DetBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.emit = payload;
    this.fillAccessKeyIfEmpty();
    return this;
  }

  @Validates(Avulsa)
  public avulsa(
    payload: IAvulsa,
  ): DestBuilder &
    RetiradaBuilder &
    EntregaBuilder &
    AutXMLBuilder &
    DetBuilder &
    AssembleNfeBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.avulsa = payload;
    return this;
  }

  @Validates(Dest)
  public dest(
    payload: IDest,
  ): RetiradaBuilder &
    EntregaBuilder &
    AutXMLBuilder &
    DetBuilder &
    AssembleNfeBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.dest = payload;
    return this;
  }

  @Validates(Local)
  public retirada(
    payload: ILocal,
  ): DestBuilder &
    EntregaBuilder &
    AutXMLBuilder &
    DetBuilder &
    AssembleNfeBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.retirada = payload;
    return this;
  }

  @Validates(Local)
  public entrega(
    payload: ILocal,
  ): DestBuilder & AutXMLBuilder & DetBuilder & AssembleNfeBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.entrega = payload;
    return this;
  }

  @Validates(AutXML)
  public autXML(
    payload: IAutXML,
  ): AutXMLBuilder & DetBuilder & AssembleNfeBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.autXML ??= [] as IAutXML[];
    this.data.infNFe.autXML.push(payload);
    return this;
  }

  public det<T>(
    items: [T, ...T[]],
    build: (ctx: ProdBuilder, item: T) => AssembleDetXmlBuilder,
  ): TotalBuilder & TranspBuilder & InfNFeBuilder {
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
  public total(payload: ITotal): TranspBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.total = payload;
    return this;
  }

  public increment(
    callback: (context: DeepPartial<ITotal>) => DeepPartial<ITotal>,
  ): TranspBuilder & TotalBuilder {
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
  public transp(payload: ITransp): CobrBuilder & PagBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.transp = payload;
    return this;
  }

  @Validates(Cobr)
  public cobr(payload: ICobr): PagBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.cobr = payload;
    return this;
  }

  @Validates(Pag)
  public pag(
    payload: IPag,
  ): AssembleNfeBuilder &
    AvulsaBuilder &
    InfAdicBuilder &
    InfSolicNFFBuilder &
    CanaBuilder &
    CompraBuilder &
    ExportaBuilder &
    InfIntermedBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.pag = payload;
    return this;
  }

  @Validates(InfIntermed)
  public infIntermed(
    payload: IInfIntermed,
  ): AssembleNfeBuilder &
    AvulsaBuilder &
    InfAdicBuilder &
    InfSolicNFFBuilder &
    CanaBuilder &
    CompraBuilder &
    ExportaBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.infIntermed = payload;
    return this;
  }

  @Validates(InfAdic)
  public infAdic(
    payload: IInfAdic,
  ): AssembleNfeBuilder &
    AvulsaBuilder &
    InfAdicBuilder &
    InfSolicNFFBuilder &
    CanaBuilder &
    CompraBuilder &
    ExportaBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.infAdic = payload;
    return this;
  }

  @Validates(Exporta)
  public exporta(
    payload: IExporta,
  ): AssembleNfeBuilder &
    AvulsaBuilder &
    InfAdicBuilder &
    InfSolicNFFBuilder &
    CanaBuilder &
    CompraBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.exporta = payload;
    return this;
  }

  @Validates(Compra)
  public compra(
    payload: ICompra,
  ): AssembleNfeBuilder &
    AvulsaBuilder &
    InfAdicBuilder &
    InfSolicNFFBuilder &
    CanaBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.compra = payload;
    return this;
  }

  @Validates(Cana)
  public cana(
    payload: ICana,
  ): AssembleNfeBuilder &
    AvulsaBuilder &
    InfAdicBuilder &
    InfSolicNFFBuilder &
    InfRespTecBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.cana = payload;
    return this;
  }

  @Validates(InfRespTec)
  public infRespTec(
    payload: IInfRespTec,
  ): AssembleNfeBuilder & AvulsaBuilder & InfAdicBuilder & InfSolicNFFBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.infRespTec = payload;
    return this;
  }

  @Validates(InfSolicNFF)
  public infSolicNFF(
    payload: ISolicNFF,
  ): AssembleNfeBuilder & InfAdicBuilder & AvulsaBuilder {
    this.data.infNFe ??= {} as IInfNFe;
    this.data.infNFe.infSolicNFF = payload;
    return this;
  }

  public quiet(): AssembleNfeBuilder {
    Reflect.deleteMetadata(ValidateErrorsMetadata, this);
    return this;
  }

  public toObject(): NFe {
    return plainToInstance(this.data, NFe);
  }

  /** @throws {NFeTsError} */
  public assemble(): Promise<string> {
    const errors = this.errors();
    if (errors) throw new NFeTsError(errors.join(', '));
    this.$total?.aggregate();
    return this.builder.build(this.toObject(), { rootName: this.root });
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
    const Id = new AccessKeyBuider().compile({
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
      pk_nItem: this.data.infNFe.$.pk_nItem,
    };
  }
}
