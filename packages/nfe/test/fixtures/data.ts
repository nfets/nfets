import { Decimal } from '@nfets/core';
import type { Emit } from '@nfets/nfe/entities/nfe/inf-nfe/emit';
import type { Ide } from '@nfets/nfe/entities/nfe/inf-nfe/ide';
import type { Pag } from '@nfets/nfe/entities/nfe/inf-nfe/pag';
import type { Transp } from '@nfets/nfe/entities/nfe/inf-nfe/transp';

export const createValidIde = (): Ide => ({
  cUF: '52',
  cNF: '78527251',
  natOp: 'Venda de mercadoria',
  mod: '55',
  serie: '99',
  nNF: '8018',
  dhEmi: '2024-06-12T06:55:26-03:00',
  dhSaiEnt: '2024-06-12T06:57:56-03:00',
  tpNF: '1',
  idDest: '2',
  cMunFG: '5212501',
  tpImp: '1',
  tpEmis: '1',
  cDV: '5',
  tpAmb: '2',
  finNFe: '1',
  indFinal: '0',
  indPres: '1',
  procEmi: '0',
  verProc: 'nfets-0.0.1',
});

export const createValidEmit = (): Emit => ({
  CRT: '1',
  xNome: 'cliente de goias',
  CNPJ: '46755763000143',
  xFant: 'cliente de goias',
  IM: '123748',
  CNAE: '1234567',
  IE: '109381599',
  enderEmit: {
    xLgr: '14 897',
    nro: '13897',
    fone: '4934420122',
    xCpl: 'teste teste',
    CEP: '72831770',
    xMun: 'Luziania',
    UF: 'GO',
    cMun: '5212501',
    cPais: '1058',
    xBairro: 'Residencial Copaibas',
  },
});

export const createValidItems = () =>
  [
    {
      description: 'Product 1',
      code: '1',
      price: 100,
      quantity: 1,
      unit: 'UN',
      total: 100,
    },
  ] as [
    {
      description: string;
      code: string;
      price: number;
      quantity: number;
      unit: string;
      total: number;
    },
    ...{
      description: string;
      code: string;
      price: number;
      quantity: number;
      unit: string;
      total: number;
    }[],
  ];

export const createValidTransp = (): Transp => ({ modFrete: '9' });

export const createValidPag = (): Pag => ({
  detPag: [{ tPag: '01', vPag: Decimal.from('100').toString() }],
});
