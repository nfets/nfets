import type {
  PdfBuilder,
  RowBuilderOptions,
} from '@nfets/core/domain/repositories/pdf-builder';
import type { DanfcePdfDocument } from '../danfce';
import type { InfProt, ProtNFe } from '@nfets/nfe/domain/entities/nfe/prot-nfe';
import type { Builder } from '@nfets/nfe/domain/entities/printable-documents/builder';
import timezones from '@nfets/core/domain/entities/brazil/timezone';

import date from '@nfets/core/application/date/date-toolkit';

export class Protocols implements Builder {
  protected static _instance?: Protocols;

  public static instance(context: DanfcePdfDocument): Protocols {
    return (this._instance ??= new Protocols(context));
  }

  protected constructor(protected readonly context: DanfcePdfDocument) {}

  protected get builder() {
    return this.context.builder;
  }

  protected isProtocoled(protNfe?: ProtNFe): protNfe is ProtNFe {
    return !!protNfe;
  }

  protected protocol(options?: RowBuilderOptions) {
    const protNfe = this.context.protNFe;
    if (!this.isProtocoled(protNfe)) return this.unprotocoled();
    return this.protocoled(protNfe.infProt, options);
  }

  protected unprotocoled() {
    return void 0;
  }

  protected metadata(options?: RowBuilderOptions) {
    const {
      nNF: _nNF,
      serie: _serie,
      dhEmi: _dhEmi,
    } = this.context.data.infNFe.ide;

    const nNF = _nNF.padStart(9, '0');
    const serie = _serie.padStart(3, '0');

    const { left, right } = this.builder.pageMargins();

    const { cUF } = this.context.data.infNFe.ide;
    const timezone = timezones[cUF];
    const dhEmi = date(_dhEmi).tz(timezone).format('DD/MM/YYYY HH:mm:ss');

    const font = this.context.defaults.font,
      bold = `${font}-Bold`;

    this.builder.row({ left: options?.x ?? left, right }, (options) =>
      this.builder
        .font(bold)
        .text(`NFC-e nº ${nNF} - série ${serie} emitida em: ${dhEmi}`, {
          ...options,
          align: 'center',
        })
        .font(font),
    );
  }

  protected protocoled(infProt: InfProt, options?: RowBuilderOptions) {
    const { dhRecbto, nProt } = infProt;
    const { left, right } = this.builder.pageMargins();

    const { cUF } = this.context.data.infNFe.ide;
    const timezone = timezones[cUF];

    const protocol = nProt.replace(/([0-9]{3})([0-9]{10})(.*)/g, '$1 $2 $3');
    const authorized = date(dhRecbto)
      .tz(timezone)
      .format('DD/MM/YYYY HH:mm:ss');

    this.builder.row({ left: options?.x ?? left, right }, (options) =>
      this.builder.text(
        `Protocolo de autorização: ${protocol}\nData de autorização: ${authorized}`,
        {
          ...options,
          align: 'center',
        },
      ),
    );
  }

  protected assemble(options?: RowBuilderOptions) {
    const { cMsg, xMsg } = this.context.protNFe?.infProt ?? {};
    const { left, right } = this.builder.pageMargins();

    if (xMsg) {
      this.builder.row({ left: options?.x ?? left, right }, (options) =>
        this.builder.text(`$(${cMsg}) ${xMsg}`, { ...options, align: 'left' }),
      );
    }

    return this.protocol(options);
  }

  public setup() {
    this.builder.font(
      this.context.defaults.font,
      this.context.options.textFontSize,
    );
  }

  public build(options?: RowBuilderOptions): PdfBuilder {
    this.setup();
    this.builder.moveDown(0.5);
    this.metadata(options);
    this.assemble(options);
    return this.builder;
  }

  public end() {
    Protocols._instance = undefined;
  }
}
