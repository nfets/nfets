import type { Prod } from './prod';
import type { Devol } from './imposto/devol';
import type { Imposto } from './imposto';

export interface DetAttributes {
  nItem?: string;
}

export interface Det {
  $: DetAttributes;
  prod: Prod;
  imposto?: Imposto;
  impostoDevol?: Devol;
  infAdProd?: string;
}
