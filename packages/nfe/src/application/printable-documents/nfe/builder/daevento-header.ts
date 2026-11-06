import { TpEvent } from '@nfets/nfe/domain/entities/constants/tp-event';
import {
  mm,
  type DanfeArea,
} from '@nfets/nfe/domain/entities/printable-documents/nfe';

import { Code128C } from './barcode';
import { DaeventoBlock } from './daevento-block';

export class DaeventoHeader extends DaeventoBlock {
  protected readonly topHeight = mm(32);
  protected readonly noticeHeight = mm(42);

  public height(): number {
    let height = this.topHeight + this.noticeHeight;
    if (this.condUso)
      height += this.condUsoBoxHeight(this.context.contentWidth);
    return height;
  }

  protected get condUso(): string {
    return this.format.sanitize(this.context.detEvento.xCondUso);
  }

  protected condUsoBoxHeight(width: number): number {
    const text = this.condUso;
    if (!text) return 0;
    const p = this.fields.padding;
    const pad = mm(2);
    const textHeight = this.fields.measure(text, width - 2 * p, { size: 7 });
    return Math.max(textHeight + pad * 2, mm(8));
  }

  protected titles(): { title: string; subtitle: string } {
    const { tpEvento, descEvento } = this.context;
    if (tpEvento === TpEvent.CartaCorrecao)
      return {
        title: 'Representação Gráfica de CC-e',
        subtitle: '(Carta de Correção Eletrônica)',
      };
    if (tpEvento === TpEvent.Cancelamento)
      return {
        title: 'Representação Gráfica de Evento',
        subtitle: '(Cancelamento de NFe)',
      };
    return {
      title: 'Representação Gráfica de Evento',
      subtitle: `(${descEvento})`,
    };
  }

  protected notice(): string {
    const { tpEvento } = this.context;
    if (tpEvento === TpEvent.CartaCorrecao)
      return (
        'De acordo com as determinações legais vigentes, vimos por meio desta ' +
        'comunicar-lhe que a Nota Fiscal, abaixo referenciada, contém irregularidades ' +
        'que estão destacadas e suas respectivas correções, solicitamos que sejam aplicadas ' +
        'essas correções ao executar seus lançamentos fiscais.'
      );
    if (tpEvento === TpEvent.Cancelamento)
      return (
        'De acordo com as determinações legais vigentes, ' +
        'vimos por meio desta comunicar-lhe que a Nota Fiscal, ' +
        'abaixo referenciada, está cancelada, solicitamos que sejam ' +
        'aplicadas essas correções ao executar seus lançamentos fiscais.'
      );
    return (
      'De acordo com as determinações legais vigentes, vimos por meio desta ' +
      `comunicar-lhe o registro do evento "${this.context.descEvento}" ` +
      'referente à Nota Fiscal abaixo, solicitamos que sejam aplicadas ' +
      'as providências necessárias aos lançamentos fiscais.'
    );
  }

  protected emitAddress(): string {
    const emit = this.context.options.emitente ?? {};
    const {
      logradouro = '',
      numero = '',
      complemento = '',
      bairro = '',
      CEP = '',
      municipio = '',
      UF = '',
      telefone = '',
      email = '',
    } = emit;

    const street = [logradouro, numero || (logradouro ? 'SN' : '')]
      .filter(Boolean)
      .join(', ');
    const withCpl = complemento ? `${street} - ${complemento}` : street;
    const cep = this.format.cep(CEP);
    const district = [bairro, cep].filter(Boolean).join(' - ');
    const city = [municipio, UF].filter(Boolean).join(' - ');
    const phone = this.format.phone(telefone);
    const cityLine = [city, phone].filter(Boolean).join(' ');
    const mail = email ? `Email: ${email}` : '';
    return [withCpl, district, cityLine, mail].filter(Boolean).join('\n');
  }

  protected drawEmit(x: number, y: number, width: number): void {
    const p = this.fields.padding;
    const height = this.topHeight;
    const emit = this.context.options.emitente ?? {};
    const razao = this.format.sanitize(emit.razao);
    const address = this.emitAddress();
    const logo = this.context.options.logo;

    this.fields.box(x, y, width, height, {
      label: 'IDENTIFICAÇÃO DO EMITENTE',
    });

    const top = y + p + this.fields.labelHeight;
    const contentHeight = y + height - p - top;
    const gap = mm(1);
    const logoSize = logo ? Math.min(contentHeight, width / 3) : 0;
    const textX = x + p + logoSize + (logo ? gap : 0);
    const textWidth = width - 2 * p - logoSize - (logo ? gap : 0);

    if (logo)
      this.builder.image(logo, x + p, top, {
        fit: [logoSize, contentHeight],
        align: 'center',
        valign: 'center',
      });

    const nameHeight = Math.min(
      this.fields.measure(razao, textWidth, { size: 11, bold: true }),
      mm(10),
    );
    const addressHeight = Math.min(
      this.fields.measure(address, textWidth, { size: 7 }),
      contentHeight - nameHeight - gap,
    );
    const blockHeight = nameHeight + (address ? gap + addressHeight : 0);
    const nameY = top + Math.max((contentHeight - blockHeight) / 2, 0);

    this.fields.text(razao, textX, nameY, textWidth, nameHeight, {
      size: 11,
      bold: true,
      align: 'center',
    });
    if (address)
      this.fields.text(
        address,
        textX,
        nameY + nameHeight + gap,
        textWidth,
        addressHeight,
        { size: 7, align: 'center' },
      );
  }

  protected labeled(
    label: string,
    value: string,
    x: number,
    y: number,
    width: number,
    height: number,
    size: number,
  ): void {
    const line = Math.max(height, this.builder.currentLineHeight(true) + 0.5);
    this.builder
      .fillColor('black')
      .font(this.context.bold)
      .fontSize(size)
      .text(label, {
        x,
        y,
        width,
        height: line,
        continued: true,
        lineBreak: false,
        ellipsis: false,
      });
    this.builder.font(this.context.defaults.font).text(value, {
      width,
      height: line,
      lineBreak: false,
      ellipsis: false,
    });
  }

  protected drawEventMeta(x: number, y: number, width: number): void {
    const { title, subtitle } = this.titles();
    const p = mm(3);
    this.fields.rect(x, y, width, this.topHeight);

    this.fields.text(title, x + p, y + mm(2), width - 2 * p, mm(8), {
      size: 14,
      bold: true,
      align: 'center',
    });
    this.fields.text(subtitle, x + p, y + mm(9), width - 2 * p, mm(6), {
      size: 10,
      align: 'center',
    });

    const { nProt, dhRegEvento } = this.context.retInfEvento;
    const metaWidth = width - 2 * p;
    const metaX = x + p;
    const size = 8;
    const row = mm(4.5);
    let cy = y + mm(16);

    this.labeled(
      'ID do Evento: ',
      this.context.eventId,
      metaX,
      cy,
      metaWidth,
      mm(5),
      size,
    );
    cy += row;
    this.labeled(
      'Criado em: ',
      this.format.dateTime(this.context.infEvento.dhEvento),
      metaX,
      cy,
      metaWidth,
      mm(5),
      size,
    );
    cy += row;

    const line = Math.max(mm(5), this.builder.currentLineHeight(true) + 0.5);
    this.builder
      .fillColor('black')
      .font(this.context.bold)
      .fontSize(size)
      .text('Protocolo: ', {
        x: metaX,
        y: cy,
        width: metaWidth,
        height: line,
        continued: true,
        lineBreak: false,
        ellipsis: false,
      });
    this.builder.font(this.context.defaults.font).text(nProt ?? '', {
      width: metaWidth,
      height: line,
      continued: true,
      lineBreak: false,
      ellipsis: false,
    });
    this.builder.font(this.context.bold).text(' - Registrado em: ', {
      width: metaWidth,
      height: line,
      continued: true,
      lineBreak: false,
      ellipsis: false,
    });
    this.builder
      .font(this.context.defaults.font)
      .text(this.format.dateTime(dhRegEvento), {
        width: metaWidth,
        height: line,
        lineBreak: false,
        ellipsis: false,
      });
  }

  protected drawNotice(x: number, y: number, width: number): void {
    const p = this.fields.padding;
    this.fields.rect(x, y, width, this.noticeHeight);
    this.fields.text(
      this.notice(),
      x + p + mm(2),
      y + mm(2),
      width - 2 * p - mm(2),
      mm(11),
      { size: 9, lineBreak: true, ellipsis: false },
    );

    const { CNPJDest, CPFDest } = this.context.retInfEvento;
    const destLabel = CNPJDest
      ? 'CNPJ do Destinatário: '
      : CPFDest
        ? 'CPF do Destinatário: '
        : '';
    const destValue = CNPJDest
      ? this.format.document(CNPJDest)
      : CPFDest
        ? this.format.document(undefined, CPFDest)
        : '';

    const chNFe = this.context.chNFe;
    const nNF = this.format.number(chNFe.slice(25, 34));
    const serie = this.format.serie(chNFe.slice(22, 25));

    const infoY = y + mm(14);
    const leftPad = mm(5);
    const leftWidth = width * 0.42;
    const barcodeWidth = mm(87);
    const barcodeHeight = mm(12);
    const lineH = mm(5);
    const textBlock = lineH * 2;
    const textY = infoY + Math.max((barcodeHeight - textBlock) / 2, 0);

    if (destLabel)
      this.labeled(
        destLabel,
        destValue,
        x + leftPad,
        textY,
        leftWidth - leftPad,
        lineH,
        10,
      );

    const nfLine = Math.max(lineH, this.builder.currentLineHeight(true) + 0.5);
    const nfWidth = leftWidth - leftPad;
    this.builder
      .fillColor('black')
      .font(this.context.bold)
      .fontSize(10)
      .text('Nota Fiscal: ', {
        x: x + leftPad,
        y: textY + lineH,
        width: nfWidth,
        height: nfLine,
        continued: true,
        lineBreak: false,
        ellipsis: false,
      });
    this.builder.font(this.context.defaults.font).text(nNF, {
      width: nfWidth,
      height: nfLine,
      continued: true,
      lineBreak: false,
      ellipsis: false,
    });
    this.builder.font(this.context.bold).text('  -   Série: ', {
      width: nfWidth,
      height: nfLine,
      continued: true,
      lineBreak: false,
      ellipsis: false,
    });
    this.builder.font(this.context.defaults.font).text(serie, {
      width: nfWidth,
      height: nfLine,
      lineBreak: false,
      ellipsis: false,
    });

    const rightX = x + leftWidth;
    const rightWidth = width - leftWidth;
    const barcodeX = rightX + Math.max((rightWidth - barcodeWidth) / 2, 0);
    if (chNFe.length === 44)
      Code128C.draw(
        this.builder,
        chNFe,
        barcodeX,
        infoY,
        Math.min(barcodeWidth, rightWidth - p),
        barcodeHeight,
      );

    this.fields.text(
      this.format.accessKey(chNFe),
      rightX,
      infoY + barcodeHeight + mm(1),
      rightWidth - p,
      mm(5),
      { size: 8, align: 'center' },
    );
  }

  protected drawCondUso(x: number, y: number, width: number): void {
    const text = this.condUso;
    if (!text) return;
    const p = this.fields.padding;
    const pad = mm(2);
    const height = this.condUsoBoxHeight(width);
    this.fields.rect(x, y, width, height);
    this.fields.text(text, x + p, y + pad, width - 2 * p, height - pad * 2, {
      size: 7,
      lineBreak: true,
      ellipsis: false,
    });
  }

  protected draw({ x, y, width }: DanfeArea): void {
    const emitWidth = Math.round(width * 0.41);
    this.drawEmit(x, y, emitWidth);
    this.drawEventMeta(x + emitWidth, y, width - emitWidth);

    const noticeY = y + this.topHeight;
    this.drawNotice(x, noticeY, width);

    if (this.condUso) this.drawCondUso(x, noticeY + this.noticeHeight, width);
  }
}
