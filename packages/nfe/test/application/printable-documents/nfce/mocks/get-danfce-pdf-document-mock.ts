import { type DanfcePdfDocument } from '@nfets/nfe/application/printable-documents/nfce/danfce';

const getDefaults = (): DanfcePdfDocument =>
  ({
    data: {
      infNFe: {
        dest: {
          xNome: 'Cliente',
          CNPJ: '03916076000583',
          CPF: undefined,
          idEstrangeiro: undefined,
          enderDest: {
            xLgr: 'Rua cliente',
            nro: '123',
            xBairro: 'Bairro cliente',
            xCpl: 'Complemento cliente',
            xMun: 'Cidade cliente',
            UF: 'SP',
            CEP: '89707093',
          },
        },
        emit: {
          xNome: 'Nome',
          enderEmit: {
            xLgr: 'Rua emitente',
            nro: '123',
            xBairro: 'Bairro emitente',
            xMun: 'Cidade emitente',
            UF: 'SP',
            fone: '49999999999',
          },
          CNPJ: '45620317000169',
          CPF: undefined,
          IE: '1234567890',
        },
      },
    },
  }) as DanfcePdfDocument;

export const getDanfcePdfDocumentMock = (
  p?: Partial<DanfcePdfDocument>,
): DanfcePdfDocument => Object.assign(getDefaults(), p);
