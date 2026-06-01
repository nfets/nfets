import { Decimal } from '@nfets/core/infrastructure';
import type { Emit } from '@nfets/nfe/domain/entities/nfe/inf-nfe/emit';
import type { Ide } from '@nfets/nfe/domain/entities/nfe/inf-nfe/ide';
import type { ISSQN } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/issqn';
import type { Pag } from '@nfets/nfe/domain/entities/nfe/inf-nfe/pag';
import type { Transp } from '@nfets/nfe/domain/entities/nfe/inf-nfe/transp';
import { TpEmis } from '@nfets/nfe/domain/entities/constants/tp-emis';

export type ValidItem = {
  description: string;
  code: string;
  price: number;
  quantity: number;
  unit: string;
  total: number;
};

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
  tpEmis: TpEmis.Normal,
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
  ] as [ValidItem, ...ValidItem[]];

export const createIssqnPayload = (overrides: Partial<ISSQN> = {}): ISSQN => ({
  vBC: '100.00',
  vAliq: '5.0000',
  vISSQN: '5.00',
  cMunFG: '5212501',
  cListServ: '01.01',
  indISS: '1',
  indIncentivo: '2',
  ...overrides,
});

export const createIssqnServiceProd = (item: ValidItem) => ({
  cProd: item.code,
  cEAN: 'SEM GTIN',
  xProd: item.description,
  NCM: '00',
  CFOP: '5933',
  uCom: item.unit,
  qCom: item.quantity,
  vUnCom: item.price,
  vProd: item.total,
  cEANTrib: 'SEM GTIN',
  uTrib: item.unit,
  qTrib: item.quantity,
  vUnTrib: item.price,
  indTot: '1',
});

export const createValidTransp = (): Transp => ({ modFrete: '9' });

export const createValidPag = (): Pag => ({
  detPag: [{ tPag: '01', vPag: Decimal.from('100').toString() }],
});
