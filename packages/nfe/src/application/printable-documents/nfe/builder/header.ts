import {
  mm,
  type DanfeArea,
  type DanfeFieldCell,
} from '@nfets/nfe/domain/entities/printable-documents/nfe';

import { DanfeBlock } from './block';
import { Code128C } from './barcode';

export class Header extends DanfeBlock {
  protected readonly topHeight = mm(32);
  protected readonly emitWidth = mm(80);
  protected readonly danfeWidth = mm(34);
  protected readonly barcodeHeight = mm(12);
  protected readonly logoHeight = this.topHeight / 3;

  public height(): number {
    const rows = 1 + this.registrationRows().length;
    return this.topHeight + rows * this.fields.rowHeight;
  }

  protected get logo(): string | undefined {
    return this.context.options.logo;
  }

  protected registrationRows(): DanfeFieldCell[][] {
    const { emit } = this.infNFe;
    return [
      [
        { label: 'INSCRIÇÃO ESTADUAL', value: emit.IE, weight: 1 },
        { label: 'INSCRIÇÃO MUNICIPAL', value: emit.IM, weight: 1 },
        {
          label: 'INSCRIÇÃO ESTADUAL DO SUBST. TRIBUT.',
          value: emit.IEST,
          weight: 1,
        },
        {
          label: 'CNPJ / CPF',
          value: this.format.document(emit.CNPJ, emit.CPF),
          weight: 1,
        },
      ],
    ];
  }

  protected emitAddress(): string {
    const { enderEmit } = this.infNFe.emit;
    const { xLgr, nro, xCpl, xBairro, CEP, xMun, UF, fone } = enderEmit;
    const complement = xCpl ? ` - ${xCpl}` : '';
    const phone = fone ? ` Fone/Fax: ${this.format.phone(fone)}` : '';
    return [
      `${xLgr}, ${nro}${complement}`,
      `${xBairro} - ${this.format.cep(CEP)}`,
      `${xMun} - ${UF}${phone}`,
    ].join('\n');
  }

  protected drawEmit(x: number, y: number): void {
    const p = this.fields.padding;
    const width = this.emitWidth;
    const height = this.topHeight;

    this.fields.box(x, y, width, height, {
      label: 'IDENTIFICAÇÃO DO EMITENTE',
    });

    const top = y + p + this.fields.labelHeight;
    const contentHeight = y + height - p - top;

    const textX = x + p;
    const textWidth = width - 2 * p;
    const gap = mm(1);

    const logo = this.logo;
    const logoSpace = logo ? this.logoHeight + gap : 0;

    const { xNome } = this.infNFe.emit;
    const address = this.emitAddress();
    const nameHeight = Math.min(
      this.fields.measure(xNome, textWidth, { size: 9, bold: true }),
      mm(10),
    );
    const addressHeight = Math.min(
      this.fields.measure(address, textWidth, { size: 7 }),
      contentHeight - logoSpace - nameHeight - gap,
    );

    const blockHeight = logoSpace + nameHeight + gap + addressHeight;
    const logoY = top + Math.max((contentHeight - blockHeight) / 2, 0);
    const nameY = logoY + logoSpace;
    const addressY = nameY + nameHeight + gap;

    if (logo) {
      this.builder.image(logo, textX, logoY, {
        fit: [textWidth, this.logoHeight],
        align: 'center',
        valign: 'center',
      });
    }

    this.fields.text(xNome, textX, nameY, textWidth, nameHeight, {
      size: 9,
      bold: true,
      align: 'center',
    });
    this.fields.text(address, textX, addressY, textWidth, addressHeight, {
      size: 7,
      align: 'center',
    });
  }

  protected drawDanfe(x: number, y: number): void {
    const width = this.danfeWidth;
    const { tpNF, nNF, serie } = this.infNFe.ide;
    const { number, total } = this.context.page;

    this.fields.rect(x, y, width, this.topHeight);
    this.fields.text('DANFE', x, y + mm(1.5), width, 14, {
      size: 12,
      bold: true,
      align: 'center',
    });
    this.fields.text(
      'Documento Auxiliar da Nota\nFiscal Eletrônica',
      x,
      y + mm(6.5),
      width,
      mm(6),
      { size: 7, align: 'center' },
    );
    this.fields.text(
      '0 - ENTRADA\n1 - SAÍDA',
      x + mm(4),
      y + mm(13),
      mm(20),
      mm(6),
      { size: 7 },
    );

    const boxSize = mm(6);
    const bx = x + width - boxSize - mm(4);
    const by = y + mm(13);
    this.fields.rect(bx, by, boxSize, boxSize);
    this.fields.text(tpNF, bx, by + mm(1), boxSize, boxSize, {
      size: 11,
      bold: true,
      align: 'center',
    });

    this.fields.text(
      `Nº. ${this.format.number(nNF)}\nSérie ${this.format.serie(serie)}\nFolha ${number}/${total}`,
      x,
      y + mm(20.5),
      width,
      mm(11),
      { size: 8, bold: true, align: 'center' },
    );
  }

  protected drawAccessKey(x: number, y: number, width: number): void {
    const p = this.fields.padding;
    const digits = this.format.accessKeyDigits();

    this.fields.rect(x, y, width, this.barcodeHeight);
    if (digits.length === 44) {
      Code128C.draw(
        this.builder,
        digits,
        x + mm(3),
        y + mm(1.5),
        width - mm(6),
        this.barcodeHeight - mm(3),
      );
    }

    const keyY = y + this.barcodeHeight;
    this.fields.box(x, keyY, width, this.fields.rowHeight, {
      label: 'CHAVE DE ACESSO',
      value: this.format.accessKey(),
      align: 'center',
    });

    const consultY = keyY + this.fields.rowHeight;
    const consultHeight =
      this.topHeight - this.barcodeHeight - this.fields.rowHeight;
    this.fields.rect(x, consultY, width, consultHeight);
    this.fields.text(
      'Consulta de autenticidade no portal nacional da NF-e\nwww.nfe.fazenda.gov.br/portal ou no site da Sefaz Autorizadora',
      x + p,
      consultY + mm(2.5),
      width - 2 * p,
      consultHeight - mm(2.5),
      { size: 7.5, align: 'center' },
    );
  }

  protected protocolCell(): DanfeFieldCell {
    const infProt = this.context.protNFe?.infProt;
    if (infProt)
      return {
        label: 'PROTOCOLO DE AUTORIZAÇÃO DE USO',
        value: `${infProt.nProt} - ${this.format.dateTime(infProt.dhRecbto)}`,
        align: 'center',
        weight: 86,
      };

    const { dhCont } = this.infNFe.ide;
    return {
      label: 'PROTOCOLO DE AUTORIZAÇÃO DE USO',
      value: this.context.status.isContingency
        ? `EMITIDA EM CONTINGÊNCIA ${this.format.dateTime(dhCont)}`.trim()
        : '',
      align: 'center',
      weight: 86,
    };
  }

  protected draw({ x, y, width }: DanfeArea): void {
    this.drawEmit(x, y);
    this.drawDanfe(x + this.emitWidth, y);

    const keyX = x + this.emitWidth + this.danfeWidth;
    this.drawAccessKey(keyX, y, x + width - keyX);

    let cy = y + this.topHeight;
    this.fields.row(x, cy, width, this.fields.rowHeight, [
      {
        label: 'NATUREZA DA OPERAÇÃO',
        value: this.infNFe.ide.natOp,
        weight: 114,
      },
      this.protocolCell(),
    ]);

    for (const cells of this.registrationRows()) {
      cy += this.fields.rowHeight;
      this.fields.row(x, cy, width, this.fields.rowHeight, cells);
    }
  }
}
