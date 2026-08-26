import { Xml2JsToolkit, type XmlToolkit } from '@nfets/core';
import { StateCodes } from '@nfets/core/domain';
import { Decimal } from '@nfets/core/infrastructure';
import { NfeXmlBuilder } from '@nfets/nfe/application/xml-builder/nfe-xml-builder';
import {
  replaceSefazSpecialChars,
  sanitizeSefazText,
  shouldStripSefazAccents,
} from '@nfets/nfe/application/xml-builder/sanitize-sefaz-text';
import { expectIsRight } from '@nfets/test/expects';
import {
  createValidEmit,
  createValidIde,
  createValidItems,
  createValidPag,
  createValidTransp,
} from '../../fixtures/data';

describe('sanitizeSefazText', () => {
  it('strips accents only for MT or cUF 51', () => {
    expect(shouldStripSefazAccents('MT')).toBe(true);
    expect(shouldStripSefazAccents('mt')).toBe(true);
    expect(shouldStripSefazAccents(StateCodes.MT)).toBe(true);
    expect(shouldStripSefazAccents('SC')).toBe(false);
    expect(shouldStripSefazAccents(StateCodes.GO)).toBe(false);
    expect(shouldStripSefazAccents(undefined)).toBe(false);
  });

  it('replaces Portuguese accents like the legacy webserver', () => {
    expect(replaceSefazSpecialChars('São José dos Quatro Marcos')).toBe(
      'Sao Jose dos Quatro Marcos',
    );
    expect(replaceSefazSpecialChars('Concórdia')).toBe('Concordia');
    expect(replaceSefazSpecialChars('Ação Nº 1')).toBe('Acao No 1');
    expect(replaceSefazSpecialChars('ÁÀÂÃÄ')).toBe('AAAAA');
    expect(replaceSefazSpecialChars('ÍÌÎÏ')).toBe('IIII');
    expect(replaceSefazSpecialChars('íìîï')).toBe('iiii');
    expect(replaceSefazSpecialChars('éèêë')).toBe('eeee');
    expect(replaceSefazSpecialChars('ÉÈÊË')).toBe('EEEE');
    expect(replaceSefazSpecialChars('óòôõºö')).toBe('oooooo');
    expect(replaceSefazSpecialChars('ÓÒÔÕÖ')).toBe('OOOOO');
    expect(replaceSefazSpecialChars('úùûü')).toBe('uuuu');
    expect(replaceSefazSpecialChars('ÚÙÛÜ')).toBe('UUUU');
    expect(replaceSefazSpecialChars('ç')).toBe('c');
    expect(replaceSefazSpecialChars('Ç')).toBe('C');
    expect(replaceSefazSpecialChars('ñ')).toBe('n');
    expect(replaceSefazSpecialChars('Ñ')).toBe('N');
  });

  it('sanitizes nested plain string fields for MT', () => {
    const payload = {
      saleTax: {
        taxIssuer: {
          xMun: 'São José dos Quatro Marcos',
          UF: 'MT',
        },
      },
      values: ['Café', null],
    };

    expect(sanitizeSefazText(payload, 'MT')).toEqual({
      saleTax: {
        taxIssuer: {
          xMun: 'Sao Jose dos Quatro Marcos',
          UF: 'MT',
        },
      },
      values: ['Cafe', null],
    });
  });

  it('keeps accents for other UFs', () => {
    const payload = { xMun: 'São José dos Quatro Marcos' };
    expect(sanitizeSefazText(payload, 'SC')).toEqual(payload);
  });

  it('does not rewrite Decimal instances', () => {
    const decimal = Decimal.from('16.00');
    const payload = {
      xMun: 'São José',
      quantity: decimal,
    };

    const sanitized = sanitizeSefazText(payload, 'MT');
    expect(sanitized.xMun).toBe('Sao Jose');
    expect(sanitized.quantity).toBe(decimal);
  });
});

describe('NfeXmlBuilder SEFAZ-MT text sanitization', () => {
  const toolkit: XmlToolkit = new Xml2JsToolkit();

  const build = (uf: 'MT' | 'GO', description: string) => {
    const ide = createValidIde();
    const emit = createValidEmit();

    if (uf === 'MT') {
      ide.cUF = StateCodes.MT;
      ide.cMunFG = '5107909';
      emit.enderEmit.UF = 'MT';
      emit.enderEmit.cMun = '5107909';
      emit.enderEmit.xMun = 'São José dos Quatro Marcos';
    } else {
      emit.enderEmit.xMun = 'São José dos Quatro Marcos';
    }

    return NfeXmlBuilder.create(toolkit)
      .infNFe({ versao: '4.00' })
      .ide(ide)
      .emit(emit)
      .det(createValidItems(), (ctx, item) =>
        ctx
          .prod({
            cProd: item.code,
            cEAN: 'SEM GTIN',
            xProd: description,
            NCM: '00',
            CFOP: '5102',
            uCom: item.unit,
            qCom: item.quantity,
            vUnCom: item.price,
            vProd: item.total,
            cEANTrib: 'SEM GTIN',
            uTrib: item.unit,
            qTrib: item.quantity,
            vUnTrib: item.price,
            indTot: '1',
          })
          .icms({
            ICMS00: {
              orig: '1',
              CST: '00',
              modBC: '0',
              vBC: '100',
              pICMS: '18.0000',
              vICMS: '18.00',
            },
          })
          .pis({ PISNT: { CST: '08' } })
          .cofins({ COFINSNT: { CST: '08' } })
          .vItem({ vItem: '100.00' }),
      )
      .transp(createValidTransp())
      .pag(createValidPag())
      .infAdic({ infCpl: 'Ação Nº 1' });
  };

  it('strips accents from XML text fields when the issuer is MT', () => {
    const result = build('MT', 'Café torrado').quiet().toObject();
    expectIsRight(result);

    expect(result.value.infNFe.emit.enderEmit.xMun).toBe(
      'Sao Jose dos Quatro Marcos',
    );
    expect(result.value.infNFe.det[0].prod.xProd).toBe('Cafe torrado');
    expect(result.value.infNFe.infAdic?.infCpl).toBe('Acao No 1');
  });

  it('keeps accents when the issuer is not MT', () => {
    const result = build('GO', 'Café torrado').quiet().toObject();
    expectIsRight(result);

    expect(result.value.infNFe.emit.enderEmit.xMun).toBe(
      'São José dos Quatro Marcos',
    );
    expect(result.value.infNFe.det[0].prod.xProd).toBe('Café torrado');
    expect(result.value.infNFe.infAdic?.infCpl).toBe('Ação Nº 1');
  });
});
