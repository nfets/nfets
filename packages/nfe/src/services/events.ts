import { TpEvent } from '../domain/entities/constants/tp-event';

export default {
  [TpEvent.Cancelamento]: {
    method: 'envEventoCancNFe',
    version: '1.00',
    descEvento: 'Cancelamento',
  },
  [TpEvent.CancelamentoSubstituicao]: {
    method: 'envEventoCancSubstNFe',
    version: '1.00',
    descEvento: 'Cancelamento por substituicao',
  },
  [TpEvent.CienciaOperacao]: {
    method: 'envConfRecebto',
    version: '1.00',
    descEvento: 'Ciencia da Operacao',
  },
};
