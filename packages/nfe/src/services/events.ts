import { TpEvent } from '../domain/entities/constants/tp-event';

export default {
  [TpEvent.CartaCorrecao]: {
    method: 'envEventoCCe',
    version: '1.00',
    descEvento: 'Carta de Correção',
  },
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
  [TpEvent.CancelamentoEventoRtc]: {
    method: 'envEvento',
    version: '1.00',
    descEvento: 'Cancelamento de Evento',
  },
  [TpEvent.InfoPagtoIntegralRtc]: {
    method: 'envEvento',
    version: '1.00',
    descEvento:
      'Informação de efetivo pagamento integral para liberar crédito presumido do adquirente',
  },
  [TpEvent.ImportacaoZfmRtc]: {
    method: 'envEvento',
    version: '1.00',
    descEvento: 'Importação em ALC/ZFM não convertida em isenção',
  },
  [TpEvent.PerecimentoTransporteFornecedorRtc]: {
    method: 'envEvento',
    version: '1.00',
    descEvento:
      'Perecimento, perda, roubo ou furto durante o transporte contratado pelo fornecedor',
  },
  [TpEvent.FornecimentoNaoRealizadoRtc]: {
    method: 'envEvento',
    version: '1.00',
    descEvento: 'Fornecimento não realizado com pagamento antecipado',
  },
  [TpEvent.AtualizacaoDataEntregaRtc]: {
    method: 'envEvento',
    version: '1.00',
    descEvento: 'Atualização da Data de Previsão de Entrega',
  },
  [TpEvent.SolApropCredPresumidoRtc]: {
    method: 'envEvento',
    version: '1.00',
    descEvento: 'Solicitação de Apropriação de crédito presumido',
  },
  [TpEvent.DestinoConsumoPessoalRtc]: {
    method: 'envEvento',
    version: '1.00',
    descEvento: 'Destinação de item para consumo pessoal',
  },
  [TpEvent.PerecimentoTransporteAdquirenteRtc]: {
    method: 'envEvento',
    version: '1.00',
    descEvento:
      'Perecimento, perda, roubo ou furto durante o transporte contratado pelo adquirente',
  },
  [TpEvent.AceiteDebitoRtc]: {
    method: 'envEvento',
    version: '1.00',
    descEvento: 'Aceite de débito na apuração por emissão de nota de crédito',
  },
  [TpEvent.ImobilizacaoItemRtc]: {
    method: 'envEvento',
    version: '1.00',
    descEvento: 'Imobilização de Item',
  },
  [TpEvent.ApropCreditoCombustivelRtc]: {
    method: 'envEvento',
    version: '1.00',
    descEvento: 'Solicitação de Apropriação de Crédito de Combustível',
  },
  [TpEvent.ApropCreditoBensRtc]: {
    method: 'envEvento',
    version: '1.00',
    descEvento:
      'Solicitação de Apropriação de Crédito para bens e serviços que dependem de atividade do adquirente',
  },
  [TpEvent.ManifestacaoTransfCredIbsRtc]: {
    method: 'envEvento',
    version: '1.00',
    descEvento:
      'Manifestação sobre Pedido de Transferência de Crédito de IBS em Operação de Sucessão',
  },
  [TpEvent.ManifestacaoTransfCredCbsRtc]: {
    method: 'envEvento',
    version: '1.00',
    descEvento:
      'Manifestação sobre Pedido de Transferência de Crédito de CBS em Operação de Sucessão',
  },
  [TpEvent.ManifestacaoFiscoTransfCredIbsRtc]: {
    method: 'envEvento',
    version: '1.00',
    descEvento:
      'Manifestação do Fisco sobre Pedido de Transferência de Crédito de IBS em Operação de Sucessão',
  },
  [TpEvent.ManifestacaoFiscoTransfCredCbsRtc]: {
    method: 'envEvento',
    version: '1.00',
    descEvento:
      'Manifestação do Fisco sobre Pedido de Transferência de Crédito de CBS em Operação de Sucessão',
  },
};
