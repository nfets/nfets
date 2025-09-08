import type { Ide } from './ide';
import type { Emit } from './emit';
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

export interface InfNFeAttributes {
  Id?: string;
  versao?: string;
}

export interface InfNFe {
  $: InfNFeAttributes;
  ide: Ide;
  emit: Emit;
  dest?: Dest;
  retirada?: Local;
  entrega?: Local;
  autXML?: AutXML[];
  infIntermed?: InfIntermed;
  exporta?: Exporta;
  compra?: Compra;
  infRespTec?: InfRespTec;
  det: Det[];
  total: Total;
  transp: Transp;
  cobr?: Cobr;
  pag: Pag;
  infAdic?: InfAdic;
  cana?: Cana;
}
