import {
  fixUtf8Mojibake,
  normalizeTransmissionStrings,
} from '@nfets/core/shared/fix-utf8-mojibake';

describe('fixUtf8Mojibake (unit)', () => {
  it('should fix sefaz rejection message with utf-8 mojibake', () => {
    const corrupted =
      'Nao informados os dados do cartÃ£o de crÃ©dito / dÃ©bito nas Formas de Pagamento da Nota Fiscal';

    expect(fixUtf8Mojibake(corrupted)).toBe(
      'Nao informados os dados do cartão de crédito / débito nas Formas de Pagamento da Nota Fiscal',
    );
  });

  it('should keep already valid utf-8 strings unchanged', () => {
    expect(
      fixUtf8Mojibake(
        'Rejeição: Código da UF informada diverge da UF solicitada',
      ),
    ).toBe('Rejeição: Código da UF informada diverge da UF solicitada');
    expect(fixUtf8Mojibake('Serviço em Operação')).toBe('Serviço em Operação');
    expect(fixUtf8Mojibake('Autorizado o uso da NF-e')).toBe(
      'Autorizado o uso da NF-e',
    );
  });

  it('should normalize nested soap response strings', () => {
    const response = {
      retEnviNFe: {
        cStat: '866',
        xMotivo:
          'Nao informados os dados do cartÃ£o de crÃ©dito / dÃ©bito nas Formas de Pagamento da Nota Fiscal',
        protNFe: {
          infProt: {
            cStat: '866',
            xMotivo:
              'Nao informados os dados do cartÃ£o de crÃ©dito / dÃ©bito nas Formas de Pagamento da Nota Fiscal',
          },
        },
      },
    };

    expect(normalizeTransmissionStrings(response)).toStrictEqual({
      retEnviNFe: {
        cStat: '866',
        xMotivo:
          'Nao informados os dados do cartão de crédito / débito nas Formas de Pagamento da Nota Fiscal',
        protNFe: {
          infProt: {
            cStat: '866',
            xMotivo:
              'Nao informados os dados do cartão de crédito / débito nas Formas de Pagamento da Nota Fiscal',
          },
        },
      },
    });
  });
});
