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
  [TpEvent.ConfirmacaoOperacao]: {
    method: 'envConfRecebto',
    version: '1.00',
    descEvento: 'Confirmacao da Operacao',
  },
  [TpEvent.CienciaOperacao]: {
    method: 'envConfRecebto',
    version: '1.00',
    descEvento: 'Ciencia da Operacao',
  },
  [TpEvent.DesconhecimentoOperacao]: {
    method: 'envConfRecebto',
    version: '1.00',
    descEvento: 'Desconhecimento da Operacao',
  },
  [TpEvent.OperacaoNaoRealizada]: {
    method: 'envConfRecebto',
    version: '1.00',
    descEvento: 'Operacao nao Realizada',
  },
};
