import type { ICMS } from './imposto/icms';
import type { IPI } from './imposto/ipi';
import type { II } from './imposto/ii';
import type { ISSQN } from './imposto/issqn';
import type { PIS, PISST } from './imposto/pis';
import type { COFINS, COFINSST } from './imposto/cofins';
import type { ICMSUFDest } from './imposto/icmsufdest';

export interface Imposto {
  vTotTrib?: number;
  ICMS?: ICMS;
  IPI?: IPI;
  II?: II;
  ISSQN?: ISSQN;
  PIS?: PIS;
  PISST?: PISST;
  COFINS?: COFINS;
  COFINSST?: COFINSST;
  ICMSUFDest?: ICMSUFDest;
}
