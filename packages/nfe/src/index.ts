import { Decimal } from '@nfets/core';

export const nfe = () => {
  console.log('success!', new Decimal(0.2).add(0.1).toNumber());
};

nfe();
