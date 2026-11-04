import type { NfeTransmitterOptions } from '@nfets/nfe/domain';
import { TpAutorRtc } from '@nfets/nfe/domain/entities/constants/tp-autor-rtc';
import { TpEvent } from '@nfets/nfe/domain/entities/constants/tp-event';
import type {
  DetEventoRtcHeader,
  EventoRtcAceiteDebito,
  EventoRtcApropCreditoBens,
  EventoRtcApropCreditoCombustivel,
  EventoRtcAtualizacaoDataEntrega,
  EventoRtcBase,
  EventoRtcCancelaEvento,
  EventoRtcDestinoConsumoPessoal,
  EventoRtcFornecimentoNaoRealizado,
  EventoRtcImobilizacaoItem,
  EventoRtcImportacaoZfm,
  EventoRtcInfoPagtoIntegral,
  EventoRtcManifestacaoFiscoTransfCred,
  EventoRtcManifestacaoTransfCred,
  EventoRtcPerecimentoAdquirente,
  EventoRtcPerecimentoFornecedor,
  EventoRtcSolApropCredPresumido,
  TpEventRtc,
} from '@nfets/nfe/domain/entities/events/rtc';
import type { PipelineEventResponse } from '@nfets/nfe/domain/entities/services/evento';
import { left, NFeTsError, right } from '@nfets/core';
import events from '@nfets/nfe/services/events';
import { EventPipeline } from './event-pipeline';

export class NfeRtcEventPipeline extends EventPipeline {
  public infoPagtoIntegral(
    payload: EventoRtcInfoPagtoIntegral,
    options: Pick<NfeTransmitterOptions, 'tpAmb'>,
  ) {
    return this.transmit(
      TpEvent.InfoPagtoIntegralRtc,
      {
        ...this.header(payload, TpAutorRtc.Emitente),
        indQuitacao: '1',
      },
      payload,
      options,
    );
  }

  public importacaoZfm(
    payload: EventoRtcImportacaoZfm,
    options: Pick<NfeTransmitterOptions, 'tpAmb'>,
  ) {
    return this.transmit(
      TpEvent.ImportacaoZfmRtc,
      {
        ...this.header(payload, TpAutorRtc.Emitente),
        gConsumo: payload.itens.map((item) => ({
          $: { nItem: item.nItem },
          vIBS: item.vIBS,
          vCBS: item.vCBS,
          gControleEstoque: {
            qtde: item.quantidade,
            unidade: item.unidade,
          },
        })),
      },
      payload,
      options,
    );
  }

  public perecimentoTransporteFornecedor(
    payload: EventoRtcPerecimentoFornecedor,
    options: Pick<NfeTransmitterOptions, 'tpAmb'>,
  ) {
    return this.transmit(
      TpEvent.PerecimentoTransporteFornecedorRtc,
      {
        ...this.header(payload, TpAutorRtc.Emitente),
        gPerecimento: payload.itens.map((item) => ({
          $: { nItem: item.nItem },
          vIBS: item.vIBS,
          vCBS: item.vCBS,
          gControleEstoque: {
            qPerecimento: item.quantidade,
            uPerecimento: item.unidade,
            vIBS: item.vIBSEstoque,
            vCBS: item.vCBSEstoque,
          },
        })),
      },
      payload,
      options,
    );
  }

  public fornecimentoNaoRealizado(
    payload: EventoRtcFornecimentoNaoRealizado,
    options: Pick<NfeTransmitterOptions, 'tpAmb'>,
  ) {
    return this.transmit(
      TpEvent.FornecimentoNaoRealizadoRtc,
      {
        ...this.header(payload, TpAutorRtc.Emitente),
        gItemNaoFornecido: payload.itens.map((item) => ({
          $: { nItem: item.nItem },
          vIBS: item.vIBS,
          vCBS: item.vCBS,
          gControleEstoque: {
            qNaoFornecida: item.quantidade,
            uNaoFornecida: item.unidade,
          },
        })),
      },
      payload,
      options,
    );
  }

  public atualizacaoDataEntrega(
    payload: EventoRtcAtualizacaoDataEntrega,
    options: Pick<NfeTransmitterOptions, 'tpAmb'>,
  ) {
    return this.transmit(
      TpEvent.AtualizacaoDataEntregaRtc,
      {
        ...this.header(payload, TpAutorRtc.Emitente),
        dPrevEntrega: payload.dPrevEntrega,
      },
      payload,
      options,
    );
  }

  public solApropCredPresumido(
    payload: EventoRtcSolApropCredPresumido,
    options: Pick<NfeTransmitterOptions, 'tpAmb'>,
  ) {
    return this.transmit(
      TpEvent.SolApropCredPresumidoRtc,
      {
        ...this.header(payload, payload.tpAutor),
        gCredPresOper: payload.itens.map((item) => ({
          $: { nItem: item.nItem },
          vBCCredPres: item.vBCCredPres,
          cCredPres: item.cCredPres,
          gIBSCredPres: item.gIBSCredPres
            ? {
                pCredPres: item.gIBSCredPres.pCredPres,
                vCredPres: item.gIBSCredPres.vCredPres,
              }
            : void 0,
          gCBSCredPres: item.gCBSCredPres
            ? {
                pCredPres: item.gCBSCredPres.pCredPres,
                vCredPres: item.gCBSCredPres.vCredPres,
              }
            : void 0,
        })),
      },
      payload,
      options,
    );
  }

  public destinoConsumoPessoal(
    payload: EventoRtcDestinoConsumoPessoal,
    options: Pick<NfeTransmitterOptions, 'tpAmb'>,
  ) {
    return this.transmit(
      TpEvent.DestinoConsumoPessoalRtc,
      {
        ...this.header(payload, payload.tpAutor),
        gConsumo: payload.itens.map((item) => ({
          $: { nItem: item.nItem },
          vIBS: item.vIBS,
          vCBS: item.vCBS,
          gControleEstoque: {
            qConsumo: item.quantidade,
            uConsumo: item.unidade,
          },
          DFeReferenciado: {
            chaveAcesso: item.chaveAcesso,
            nItem: item.nItemRef,
          },
        })),
      },
      payload,
      options,
    );
  }

  public perecimentoTransporteAdquirente(
    payload: EventoRtcPerecimentoAdquirente,
    options: Pick<NfeTransmitterOptions, 'tpAmb'>,
  ) {
    return this.transmit(
      TpEvent.PerecimentoTransporteAdquirenteRtc,
      {
        ...this.header(payload, TpAutorRtc.Destinatario),
        gPerecimento: payload.itens.map((item) => ({
          $: { nItem: item.nItem },
          vIBS: item.vIBS,
          vCBS: item.vCBS,
          gControleEstoque: {
            qPerecimento: item.quantidade,
            uPerecimento: item.unidade,
          },
        })),
      },
      payload,
      options,
    );
  }

  public aceiteDebito(
    payload: EventoRtcAceiteDebito,
    options: Pick<NfeTransmitterOptions, 'tpAmb'>,
  ) {
    return this.transmit(
      TpEvent.AceiteDebitoRtc,
      {
        ...this.header(payload, TpAutorRtc.Destinatario),
        indAceitacao: payload.indAceitacao,
      },
      payload,
      options,
    );
  }

  public imobilizacaoItem(
    payload: EventoRtcImobilizacaoItem,
    options: Pick<NfeTransmitterOptions, 'tpAmb'>,
  ) {
    return this.transmit(
      TpEvent.ImobilizacaoItemRtc,
      {
        ...this.header(payload, TpAutorRtc.Destinatario),
        gImobilizacao: payload.itens.map((item) => ({
          $: { nItem: item.nItem },
          vIBS: item.vIBS,
          vCBS: item.vCBS,
          gControleEstoque: {
            qImobilizado: item.quantidade,
            uImobilizado: item.unidade,
          },
        })),
      },
      payload,
      options,
    );
  }

  public apropCreditoCombustivel(
    payload: EventoRtcApropCreditoCombustivel,
    options: Pick<NfeTransmitterOptions, 'tpAmb'>,
  ) {
    return this.transmit(
      TpEvent.ApropCreditoCombustivelRtc,
      {
        ...this.header(payload, TpAutorRtc.Destinatario),
        gConsumoComb: payload.itens.map((item) => ({
          $: { nItem: item.nItem },
          vIBS: item.vIBS,
          vCBS: item.vCBS,
          gControleEstoque: {
            qComb: item.quantidade,
            uComb: item.unidade,
          },
        })),
      },
      payload,
      options,
    );
  }

  public apropCreditoBens(
    payload: EventoRtcApropCreditoBens,
    options: Pick<NfeTransmitterOptions, 'tpAmb'>,
  ) {
    return this.transmit(
      TpEvent.ApropCreditoBensRtc,
      {
        ...this.header(payload, TpAutorRtc.Destinatario),
        gCredito: payload.itens.map((item) => ({
          $: { nItem: item.nItem },
          vCredIBS: item.vCredIBS,
          vCredCBS: item.vCredCBS,
        })),
      },
      payload,
      options,
    );
  }

  public manifestacaoTransfCredIbs(
    payload: EventoRtcManifestacaoTransfCred,
    options: Pick<NfeTransmitterOptions, 'tpAmb'>,
  ) {
    return this.transmit(
      TpEvent.ManifestacaoTransfCredIbsRtc,
      {
        ...this.header(payload, TpAutorRtc.Sucessora),
        indAceitacao: payload.indAceitacao,
      },
      payload,
      options,
    );
  }

  public manifestacaoTransfCredCbs(
    payload: EventoRtcManifestacaoTransfCred,
    options: Pick<NfeTransmitterOptions, 'tpAmb'>,
  ) {
    return this.transmit(
      TpEvent.ManifestacaoTransfCredCbsRtc,
      {
        ...this.header(payload, TpAutorRtc.Sucessora),
        indAceitacao: payload.indAceitacao,
      },
      payload,
      options,
    );
  }

  public cancelaEvento(
    payload: EventoRtcCancelaEvento,
    options: Pick<NfeTransmitterOptions, 'tpAmb'>,
  ) {
    return this.transmit(
      TpEvent.CancelamentoEventoRtc,
      {
        cOrgaoAutor: payload.cOrgaoAutor,
        verAplic: payload.verAplic ?? '4.00',
        tpEventoAut: payload.tpEventoAut,
        nProtEvento: payload.nProtEvento,
      },
      payload,
      options,
    );
  }

  public manifestacaoFiscoTransfCredIbs(
    payload: EventoRtcManifestacaoFiscoTransfCred,
    options: Pick<NfeTransmitterOptions, 'tpAmb'>,
  ) {
    return this.transmit(
      TpEvent.ManifestacaoFiscoTransfCredIbsRtc,
      {
        ...this.header(payload, TpAutorRtc.Fisco),
        indDeferimento: payload.indDeferimento,
        cMotivo: payload.cMotivo,
        xMotivo: payload.xMotivo,
      },
      payload,
      options,
    );
  }

  public manifestacaoFiscoTransfCredCbs(
    payload: EventoRtcManifestacaoFiscoTransfCred,
    options: Pick<NfeTransmitterOptions, 'tpAmb'>,
  ) {
    return this.transmit(
      TpEvent.ManifestacaoFiscoTransfCredCbsRtc,
      {
        ...this.header(payload, TpAutorRtc.Fisco),
        indDeferimento: payload.indDeferimento,
        cMotivo: payload.cMotivo,
        xMotivo: payload.xMotivo,
      },
      payload,
      options,
    );
  }

  private header(
    payload: EventoRtcBase,
    tpAutor: TpAutorRtc,
  ): DetEventoRtcHeader {
    return {
      cOrgaoAutor: payload.cOrgaoAutor,
      tpAutor,
      verAplic: payload.verAplic ?? '4.00',
    };
  }

  private async transmit(
    tpEvento: TpEventRtc,
    detEvento: object,
    payload: EventoRtcBase,
    options: Pick<NfeTransmitterOptions, 'tpAmb'>,
  ) {
    if (payload.chNFe.slice(20, 22) !== '55') {
      return left(
        new NFeTsError(
          'Eventos RTC atendem apenas NF-e modelo 55 (chave informada não é modelo 55)',
        ),
      );
    }

    const infEvento = {
      chNFe: payload.chNFe,
      dhEvento: payload.dhEvento ?? new Date().toISOString(),
      detEvento,
      nSeqEvento: payload.nSeqEvento ?? 1,
      identification: payload.identification,
      cOrgao: '92' as const,
    };

    const eventOrLeft = await this.event(tpEvento, infEvento, options);
    if (eventOrLeft.isLeft()) return eventOrLeft;

    const evento = eventOrLeft.value;
    const version = events[tpEvento].version;

    const responseOrLeft = await this.transmitter.recepcaoEvento({
      idLote: payload.idLote ?? new Date().getTime().toString().slice(0, 15),
      evento,
    });
    if (responseOrLeft.isLeft()) return responseOrLeft;

    const response = responseOrLeft.value;
    const retEvento = response.retEnvEvento.retEvento;
    if (!retEvento)
      return left(new NFeTsError('Evento RTC não retornado pela SEFAZ'));

    const xml = await this.protocol(
      this.versionedEvent(evento, version),
      retEvento,
      version,
    );

    return right({ xml, response } satisfies PipelineEventResponse);
  }
}
