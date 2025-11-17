import { TpEvent } from '../domain/entities/constants/tp-event';

export default {
  [TpEvent.Cancelamento]: {
    method: 'envEventoCancNFe',
    version: '1.00',
    descEvento: 'Cancelamento',
  },
};
