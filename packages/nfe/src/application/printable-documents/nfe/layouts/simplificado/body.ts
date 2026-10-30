import { Environment, dateToolkit, timezones } from '@nfets/core';
import type { PdfBuilder } from '@nfets/core/domain/repositories/pdf-builder';
import type { Local } from '@nfets/nfe/domain/entities/nfe/inf-nfe/local';
import { TpEmis } from '@nfets/nfe/domain';
import type { Builder } from '@nfets/nfe/domain/entities/printable-documents/builder';

import {
  defaultCreditsText,
  mmToPt,
} from '@nfets/nfe/domain/entities/printable-documents/nfce';

import { Items } from '../../../nfce/builder/items';
import { Code128C } from '../../builder/barcode';
import type { DanfeSimplificadoDocument } from './document';

const typeBoxSize = 11;

export class SimplificadoBody implements Builder {
  private static current?: SimplificadoBody;

  public static instance(context: DanfeSimplificadoDocument): SimplificadoBody {
    return (SimplificadoBody.current ??= new SimplificadoBody(context));
  }

  private constructor(private readonly context: DanfeSimplificadoDocument) {}

  private get builder() {
    return this.context.builder;
  }

  private get font() {
    return this.context.defaults.font;
  }

  private get infNFe() {
    return this.context.data.infNFe;
  }

  public setup() {
    this.builder.font(this.font, this.context.options.textFontSize);
  }

  public build(): PdfBuilder {
    this.setup();
    this.title();
    if (this.context.showsItems()) return this.reduced();
    return this.label();
  }

  private reduced(): PdfBuilder {
    this.gap(0.5);
    this.accessKey();
    this.gap();
    this.emitter();
    this.gap(0.35);
    this.notices();
    this.gap(0.35);
    this.operation();
    this.gap();
    this.recipient();
    this.gap();
    this.items();
    this.gap(1.2);
    this.totals();
    this.gap(1);
    this.tributes();
    this.gap(0.8);
    this.complementary();
    this.credits();
    return this.builder;
  }

  private label(): PdfBuilder {
    this.gap(0.5);
    this.accessKey();
    this.gap(0.35);
    this.notices();
    this.gap(0.35);
    this.protocol();
    this.gap();
    this.emitter();
    this.place();
    this.gap();
    this.identification();
    this.gap();
    this.recipient();
    this.gap(1.2);
    this.totals();
    this.epec();
    this.gap(0.7);
    this.complementary();
    this.credits();
    return this.builder;
  }

  private gap(lines = 0.9) {
    this.builder.moveDown(lines);
  }

  public end() {
    SimplificadoBody.current = undefined;
  }

  private title() {
    const { left, right } = this.builder.pageMargins();
    this.builder
      .font(`${this.font}-Bold`, this.context.options.titleFontSize)
      .row({ left, right }, (options) =>
        this.builder.text(this.context.title(), {
          ...options,
          align: 'center',
        }),
      );
    this.setup();
  }

  private notices() {
    const { tpAmb, tpEmis } = this.infNFe.ide;
    if (tpAmb !== Environment.Production) this.line('SEM VALOR FISCAL', true);
    if (!this.context.showsItems() && tpEmis !== TpEmis.Normal)
      this.line('EMITIDA EM CONTINGÊNCIA', true);
  }

  private operation() {
    const { tpNF, serie, nNF, dhEmi, tpEmis } = this.infNFe.ide;
    this.line(
      tpEmis === TpEmis.Normal ? 'EMISSÃO NORMAL' : 'EMISSÃO EM CONTINGÊNCIA',
      true,
    );
    this.typeBox(tpNF);
    this.gap(0.25);
    this.centeredFields([
      ['Número:', this.dotted(nNF)],
      ['Série:', serie.padStart(3, '0')],
      ['Emissão', this.when(dhEmi, false)],
    ]);
  }

  private identification() {
    const { tpNF, serie, nNF, dhEmi } = this.infNFe.ide;
    const { left, right } = this.builder.pageMargins();
    const y = this.builder.y();
    const width = this.builder.pageWidth() - left - right;
    const column = width / 3;
    const size = this.context.options.textFontSize;
    const step = this.builder.currentLineHeight(true) + 2;

    this.caption('SÉRIE:', serie.padStart(3, '0'), left, y, column);
    this.builder.font(`${this.font}-Bold`, size);
    this.builder.text('DATA EMISSÃO', {
      x: left + column,
      y,
      width: column,
      align: 'center',
    });
    this.builder.text('TIPO OPERAÇÃO', {
      x: left + column * 2,
      y,
      width: column,
      align: 'center',
    });

    const second = y + step;
    this.caption('Nº:', this.dotted(nNF), left, second, column);
    this.builder.font(this.font, size);
    this.builder.text(this.when(dhEmi, false), {
      x: left + column,
      y: second,
      width: column,
      align: 'center',
    });
    this.builder.text('0 - ENTRADA', {
      x: left + column * 2,
      y: second,
      width: column - 14,
      align: 'left',
    });
    this.drawType(tpNF, left + width - typeBoxSize - 1, second);
    const third = second + step;
    this.builder.text('1 - SAÍDA', {
      x: left + column * 2,
      y: third,
      width: column - 14,
      align: 'left',
    });
    this.builder.text('', { x: left, y: third + step });
    this.setup();
  }

  private caption(
    label: string,
    value: string,
    x: number,
    y: number,
    width: number,
  ) {
    const size = this.context.options.textFontSize;
    const prefix = `${label} `;
    this.builder.font(`${this.font}-Bold`, size);
    const labelWidth = this.builder.widthOfString(prefix);
    this.builder.text(prefix, { x, y, lineBreak: false });
    this.builder.font(this.font, size);
    this.builder.text(value, {
      x: x + labelWidth,
      y,
      width: Math.max(width - labelWidth, 10),
      align: 'left',
    });
  }

  private typeBox(tpNF: string) {
    const { left, right } = this.builder.pageMargins();
    const y = this.builder.y();
    const width = this.builder.pageWidth() - left - right;
    const label = '0 - ENTRADA / 1 - SAÍDA';
    const labelWidth = this.builder.widthOfString(label);
    const block = typeBoxSize + 4 + labelWidth;
    const start = left + (width - block) / 2;
    this.drawType(tpNF, start, y);
    this.builder
      .font(this.font, this.context.options.textFontSize)
      .text(label, {
        x: start + typeBoxSize + 4,
        y: y + (typeBoxSize - this.builder.currentLineHeight(false)) / 2,
        width: labelWidth,
      });
    this.builder.text('', { x: left, y: y + typeBoxSize + 2 });
    this.setup();
  }

  private drawType(tpNF: string, x: number, y: number) {
    this.builder
      .lineWidth(0.3)
      .rect(x, y, typeBoxSize, typeBoxSize)
      .stroke()
      .lineWidth(1);
    this.builder.font(`${this.font}-Bold`, this.context.options.textFontSize);
    const width = this.builder.widthOfString(tpNF);
    const height = this.builder.currentLineHeight(false);
    this.builder.text(tpNF, {
      x: x + (typeBoxSize - width) / 2,
      y: y + (typeBoxSize - height) / 2,
      lineBreak: false,
    });
  }

  private emitter() {
    const { emit } = this.infNFe;
    const { xLgr, nro, xBairro, xMun, UF } = emit.enderEmit;
    if (this.context.showsItems()) {
      this.line(emit.xNome);
      this.line(`${xLgr}, ${nro} - ${xBairro} - ${xMun} - ${UF}`);
      this.centeredFields([
        ['CNPJ:', this.taxId(emit.CNPJ, emit.CPF)],
        ['IE:', emit.IE],
      ]);
      return;
    }
    if (this.context.options.logo) {
      this.emitterWithLogo(emit.xNome, UF);
      return;
    }
    this.field('NOME/RAZÃO SOCIAL:', emit.xNome);
    this.fields([
      ['CNPJ:', this.taxId(emit.CNPJ, emit.CPF)],
      ['IE:', emit.IE],
      ['UF:', UF],
    ]);
  }

  private emitterWithLogo(xNome: string, UF: string) {
    const logo = this.context.options.logo;
    if (!logo) return;
    const { emit } = this.infNFe;
    const { left, right } = this.builder.pageMargins();
    const y = this.builder.y();
    const pageWidth = this.builder.pageWidth() - left - right;
    const size = this.context.options.textFontSize;
    this.builder.font(this.font, size);
    const lineH = this.builder.currentLineHeight(true) + 2;
    const logoSize = lineH * 2 + 2;
    const gap = 3 / mmToPt;
    const textX = left + logoSize + gap;
    const textWidth = pageWidth - logoSize - gap;

    this.builder.image(logo, left, y, {
      fit: [logoSize, logoSize],
      align: 'left',
      valign: 'top',
    });

    this.field('NOME/RAZÃO SOCIAL:', xNome, textX, textWidth);
    this.fields(
      [
        ['CNPJ:', this.taxId(emit.CNPJ, emit.CPF)],
        ['IE:', emit.IE],
        ['UF:', UF],
      ],
      textX,
    );

    const after = this.builder.y();
    if (after < y + logoSize)
      this.builder.text('', { x: left, y: y + logoSize + 2 });
  }

  private place() {
    if (this.context.showsItems()) return;
    const { entrega, retirada } = this.infNFe;
    const delivery = this.located(entrega);
    const pickup = this.located(retirada);
    const place = delivery ? entrega : pickup ? retirada : undefined;
    if (!place) return;
    this.gap();
    this.line(
      delivery
        ? 'INFORMAÇÕES DO LOCAL DE ENTREGA'
        : 'INFORMAÇÕES DO LOCAL DE RETIRADA',
      true,
    );
    this.field('CNPJ/CPF:', this.taxId(place.CNPJ, place.CPF));
    this.fields([
      ['', place.xNome ?? ''],
      ['IE:', place.IE ?? ''],
    ]);
    this.line(`${place.xLgr}, ${place.nro}`, false, 'left');
    this.line(place.xBairro, false, 'left');
    this.line(
      `${place.xMun}-${place.UF}${this.phoneSuffix(place.fone)}`,
      false,
      'left',
    );
  }

  private recipient() {
    const dest = this.infNFe.dest;
    if (!dest) return;
    const address = dest.enderDest;
    const doc = this.taxId(dest.CNPJ, dest.CPF);
    this.line('DESTINATÁRIO', true, 'center', false);
    this.gap(0.2);
    if (this.context.showsItems()) {
      this.line(dest.xNome ?? '');
      if (address)
        this.line(
          `${address.xLgr}, ${address.nro} - ${address.xBairro} - ${address.xMun} - ${address.UF}`,
        );
      this.centeredFields([
        [dest.CNPJ ? 'CNPJ:' : 'CPF:', doc],
        ...(dest.IE ? ([['IE:', dest.IE]] as [string, string][]) : []),
      ]);
      return;
    }
    this.field('NOME/RAZÃO SOCIAL:', dest.xNome ?? '');
    this.fields([
      ['CNPJ/CPF:', doc],
      ...(dest.IE ? ([['IE:', dest.IE]] as [string, string][]) : []),
    ]);
    if (!address) return;
    const cep = this.cep(address.CEP);
    this.field(
      'ENDEREÇO:',
      `${address.xLgr}, ${address.nro} - ${address.xBairro}  ${cep}  ${address.xMun}  UF: ${address.UF}`,
    );
  }

  private items() {
    if (!this.context.showsItems()) return;
    const items = Items.instance(this.context);
    items.build();
    items.end();
  }

  private totals() {
    const { vProd, vDesc, vNF } = this.infNFe.total.ICMSTot;
    if (this.context.showsItems()) {
      const count = [this.infNFe.det].flat().length;
      this.pair('Qtd. Total de Itens', String(count), true);
      this.pair(
        'Valor Total dos Produtos R$',
        this.context.currency(vProd),
        true,
      );
      this.pair('Valor Descontos R$', this.context.currency(vDesc), true);
      this.pair('Valor Total R$', this.context.currency(vNF), true);
      return;
    }
    this.totalLine(
      'VALOR TOTAL DA NOTA FISCAL:',
      `R$ ${this.context.currency(vNF)}`,
    );
  }

  private totalLine(label: string, value: string) {
    const { left, right } = this.builder.pageMargins();
    const y = this.builder.y();
    const width = this.builder.pageWidth() - left - right;
    const size = this.context.options.textFontSize;
    this.builder.font(`${this.font}-Bold`, size);
    this.builder.text(label, { x: left, y, lineBreak: false });
    this.builder.font(this.font, size);
    this.builder.text(value, {
      x: left,
      y,
      width,
      align: 'right',
      lineBreak: false,
    });
    this.builder.text('', {
      x: left,
      y: y + this.builder.currentLineHeight(true) + 2,
    });
    this.setup();
  }

  private tributes() {
    if (!this.context.showsItems()) return;
    const value = this.infNFe.total.ICMSTot.vTotTrib;
    const amount = value ? this.context.currency(value) : '-----';
    this.line(
      `Informação dos Tributos Totais Incidentes (Lei Federal 12.741/2012): R$ ${amount}`,
      false,
      'left',
    );
  }

  private complementary() {
    const text = [this.infNFe.infAdic?.infCpl, this.infAdFisco()]
      .filter((line) => line)
      .join('\n');
    if (!text) return;
    this.line(text.replace(/;/g, '\n'), false, 'left');
  }

  private credits() {
    const credits = this.context.options.credits;
    if (!credits) return;
    this.gap(0.5);
    const { left, right } = this.builder.pageMargins();
    this.builder
      .font(this.font, this.context.options.textFontSize)
      .row({ left, right }, (options) =>
        this.builder.text(credits, {
          ...options,
          align: 'center',
          link:
            credits === defaultCreditsText
              ? 'https://github.com/nfets/nfets'
              : void 0,
        }),
      );
    this.setup();
  }

  private infAdFisco(): string {
    if (this.context.showsItems()) return '';
    return this.infNFe.infAdic?.infAdFisco ?? '';
  }

  private epec() {
    if (!this.context.showsEpec()) return;
    const { tpEmis, dhCont } = this.infNFe.ide;
    if (tpEmis !== TpEmis.EPEC) return;
    const protocol = this.context.protNFe?.infProt;
    const value = protocol
      ? `${protocol.nProt} ${this.when(protocol.dhRecbto)}`
      : this.when(dhCont);
    this.gap();
    this.line('PROTOCOLO DE AUTORIZAÇÃO DO EPEC', true);
    this.line(value);
  }

  private accessKey() {
    const digits = this.infNFe.$.Id?.substring(3) ?? '';
    const grouped = digits.replace(/(.{4})/g, '$1 ').trim();
    if (this.context.showsItems()) {
      this.barcode(digits);
      this.gap(0.3);
      this.line('CHAVE DE ACESSO', true, 'center', false);
      this.line(grouped);
      this.gap(0.8);
      this.line('Protocolo de Autorização', true, 'center', false);
      this.protocolValue();
      return;
    }
    this.line('CHAVE DE ACESSO', true, 'left');
    this.gap(0.3);
    this.barcode(digits);
    this.gap(0.3);
    this.line(grouped);
  }

  private protocol() {
    this.line('PROTOCOLO DE AUTORIZAÇÃO DE USO', true, 'center', false);
    this.protocolValue();
  }

  private protocolValue() {
    const protocol = this.context.protNFe?.infProt;
    this.line(
      protocol
        ? `${protocol.nProt} ${this.when(protocol.dhRecbto)}`
        : 'Pendente de autorização',
    );
  }

  private barcode(digits: string) {
    if (digits.length !== 44) return;
    const { left, right } = this.builder.pageMargins();
    const y = this.builder.y();
    const width = this.builder.pageWidth() - left - right;
    const height = 8 / mmToPt;
    Code128C.draw(this.builder, digits, left, y, width, height);
    this.builder.text('', { y: y + height });
  }

  private pair(label: string, value: string, boldLabel = false) {
    const { left, right } = this.builder.pageMargins();
    this.builder.row(
      { columns: 2, left, right },
      (options) => {
        this.builder.font(
          boldLabel ? `${this.font}-Bold` : this.font,
          this.context.options.textFontSize,
        );
        return this.builder.text(label, { ...options, align: 'left' });
      },
      (options) => {
        this.builder.font(this.font, this.context.options.textFontSize);
        return this.builder.text(value, { ...options, align: 'right' });
      },
    );
    this.setup();
  }

  private field(
    label: string,
    value: string,
    startX?: number,
    maxWidth?: number,
  ) {
    const { left, right } = this.builder.pageMargins();
    const x = startX ?? left;
    const y = this.builder.y();
    const size = this.context.options.textFontSize;
    const width = maxWidth ?? this.builder.pageWidth() - left - right;
    const prefix = label ? `${label} ` : '';
    this.builder.font(`${this.font}-Bold`, size);
    const labelWidth = prefix ? this.builder.widthOfString(prefix) : 0;
    if (prefix) this.builder.text(prefix, { x, y, lineBreak: false });
    this.builder.font(this.font, size);
    const valueWidth = Math.max(width - labelWidth, 10);
    const height = this.builder.heightOfString(value || ' ', {
      width: valueWidth,
      lineGap: 2,
    });
    this.builder.text(value, {
      x: x + labelWidth,
      y,
      width: valueWidth,
      lineGap: 2,
    });
    this.builder.text('', { x: left, y: y + height });
    if (!this.context.showsItems()) this.builder.moveDown(0.15);
    this.setup();
  }

  private fields(parts: [string, string][], startX?: number) {
    this.writeFields(parts, startX ?? this.builder.pageMargins().left);
  }

  private centeredFields(parts: [string, string][]) {
    const { left, right } = this.builder.pageMargins();
    const size = this.context.options.textFontSize;
    let total = 0;
    for (const [label, value] of parts) {
      if (label) {
        this.builder.font(`${this.font}-Bold`, size);
        total += this.builder.widthOfString(`${label} `);
      }
      if (value) {
        this.builder.font(this.font, size);
        total += this.builder.widthOfString(`${value}  `);
      }
    }
    const width = this.builder.pageWidth() - left - right;
    this.writeFields(parts, left + Math.max((width - total) / 2, 0));
  }

  private writeFields(parts: [string, string][], startX: number) {
    const { left } = this.builder.pageMargins();
    const y = this.builder.y();
    const size = this.context.options.textFontSize;
    let x = startX;
    for (const [label, value] of parts) {
      if (!label && !value) continue;
      if (label) {
        const text = `${label} `;
        this.builder.font(`${this.font}-Bold`, size);
        this.builder.text(text, { x, y, lineBreak: false });
        x += this.builder.widthOfString(text);
      }
      if (value) {
        const text = `${value}  `;
        this.builder.font(this.font, size);
        this.builder.text(text, { x, y, lineBreak: false });
        x += this.builder.widthOfString(text);
      }
    }
    this.builder.text('', {
      x: left,
      y: y + this.builder.currentLineHeight(true) + 2,
    });
    this.builder.moveDown(0.15);
    this.setup();
  }

  private line(
    text: string,
    bold = false,
    align: 'center' | 'left' = 'center',
    spaceAfter = true,
  ) {
    if (!text) return;
    const { left, right } = this.builder.pageMargins();
    this.builder
      .font(
        bold ? `${this.font}-Bold` : this.font,
        this.context.options.textFontSize,
      )
      .row({ left, right }, (options) =>
        this.builder.text(text, { ...options, align, lineGap: 2 }),
      );
    if (spaceAfter) this.builder.moveDown(0.15);
    this.setup();
  }

  private when(value?: string, time = true): string {
    if (!value) return '';
    const { cUF } = this.infNFe.ide;
    const pattern = time ? 'DD/MM/YYYY HH:mm:ss' : 'DD/MM/YYYY';
    return dateToolkit(value).tz(timezones[cUF]).format(pattern);
  }

  private dotted(nNF: string): string {
    return nNF.padStart(9, '0').replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
  }

  private cep(value?: string): string {
    if (!value) return '';
    if (value.length === 8) return value.replace(/(\d{5})(\d{3})/, '$1-$2');
    return value;
  }

  private phoneSuffix(phone?: string): string {
    const formatted = this.phone(phone);
    return formatted ? `  Fone: ${formatted}` : '';
  }

  private phone(phone?: string): string {
    if (!phone) return '';
    const mask =
      phone.length >= 11 ? /(\d{2})(\d{5})(\d{4})/ : /(\d{2})(\d{4})(\d{4})/;
    return phone.replace(mask, '($1) $2-$3');
  }

  private located(place?: Local): boolean {
    return Boolean(place?.CNPJ ?? place?.CPF);
  }

  private taxId(cnpj?: string, cpf?: string): string {
    if (cnpj?.length === 14)
      return cnpj.replace(
        /([A-Z0-9]{2})([A-Z0-9]{3})([A-Z0-9]{3})([A-Z0-9]{4})([A-Z0-9]{2})/,
        '$1.$2.$3/$4-$5',
      );
    if (cpf?.length === 11)
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    return '';
  }
}
