import type { Ide } from './ide';
import type { Emit } from './emit';
import type { Avulsa } from './avulsa';
import type { Dest } from './dest';
import type { Local } from './local';
import type { AutXML } from './autxml';
import type { InfIntermed } from './infintermed';
import type { Exporta } from './exporta';
import type { Compra } from './compra';
import type { InfRespTec } from './infresptec';
import type { Det } from './det';
import type { Total } from './total';
import type { Transp } from './transp';
import type { Cobr } from './cobr';
import type { Pag } from './pag';
import type { InfAdic } from './infadic';
import type { Cana } from './cana';
import type { InfSolicNFF } from './inf-solic-nff';

export interface InfNFeAttributes {
  Id?: string;
  versao?: string;
  pk_nItem?: string;
}

export interface InfNFe {
  $: InfNFeAttributes;
  ide: Ide;
  emit: Emit;
  avulsa?: Avulsa;
  dest?: Dest;
  retirada?: Local;
  entrega?: Local;
  autXML?: AutXML[];
  det: [Det, ...Det[]];
  total: Total;
  transp: Transp;
  cobr?: Cobr;
  pag: Pag;
  infIntermed?: InfIntermed;
  infAdic?: InfAdic;
  exporta?: Exporta;
  compra?: Compra;
  cana?: Cana;
  infRespTec?: InfRespTec;
  infSolicNFF?: InfSolicNFF;
}
