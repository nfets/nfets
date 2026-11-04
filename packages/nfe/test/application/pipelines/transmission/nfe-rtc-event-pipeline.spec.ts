import { NfeRtcEventPipeline } from '@nfets/nfe/application/pipelines/transmission/nfe-rtc-event-pipeline';
import { NfeRemoteTransmitter } from '@nfets/nfe/application/transmission/nfe-transmitter';
import { Environment } from '@nfets/core/domain';
import { left, right } from '@nfets/core/shared';
import { NFeTsError } from '@nfets/core';
import { TpAutorRtc } from '@nfets/nfe/domain/entities/constants/tp-autor-rtc';
import { TpEvent } from '@nfets/nfe/domain/entities/constants/tp-event';
import events from '@nfets/nfe/services/events';
import webservices from '@nfets/nfe/services/webservices-mod55';

const chNFe = '35240100000000000000550010000000011000000010';
const chNFe65 = '35240100000000000000650010000000011000000010';
const identification = 'N4BW1CV0000100';
const certificate = { pfxPathOrBase64: 'mock', password: 'mock' };
const options = { tpAmb: Environment.Homolog };
const base = {
  chNFe,
  identification,
  cOrgaoAutor: '35' as const,
};

const signedEvento = {
  $: { xmlns: 'http://www.portalfiscal.inf.br/nfe' },
  infEvento: {
    $: { Id: `ID${TpEvent.InfoPagtoIntegralRtc}${chNFe}01` },
    cOrgao: '92',
    tpAmb: Environment.Homolog,
    CNPJ: identification,
    chNFe,
    dhEvento: '2025-12-22T18:40:33.060Z',
    tpEvento: TpEvent.InfoPagtoIntegralRtc,
    nSeqEvento: 1,
    verEvento: '1.00',
    detEvento: {
      $: { versao: '1.00' },
      descEvento: events[TpEvent.InfoPagtoIntegralRtc].descEvento,
      cOrgaoAutor: '35',
      tpAutor: TpAutorRtc.Emitente,
      verAplic: '4.00',
      indQuitacao: '1',
    },
  },
};

const retEventoSuccess = {
  $: { versao: '1.00' },
  infEvento: {
    tpAmb: '2',
    verAplic: '1.0',
    cOrgao: '92',
    cStat: '135',
    xMotivo: 'Evento registrado e vinculado a NF-e',
    chNFe,
    tpEvento: TpEvent.InfoPagtoIntegralRtc,
    nSeqEvento: '1',
    dhRegEvento: '2025-12-22T18:40:33.060Z',
    nProt: '135240000000002',
  },
};

const retEventoRejected = {
  $: { versao: '1.00' },
  infEvento: {
    tpAmb: '2',
    verAplic: '1.0',
    cOrgao: '92',
    cStat: '573',
    xMotivo: 'Rejeicao: Duplicidade de Evento',
    dhRegEvento: '2025-12-22T18:40:33.060Z',
  },
};

const lote = (retEvento?: unknown) =>
  right({
    retEnvEvento: {
      cStat: '128',
      xMotivo: 'Lote de Evento Processado',
      ...(retEvento ? { retEvento } : {}),
    },
  });

const itemBase = {
  nItem: '1',
  vIBS: '10.00',
  vCBS: '20.00',
  quantidade: '1.0000',
  unidade: 'UN',
};

class MappingPipeline extends NfeRtcEventPipeline {
  public readonly eventMock = jest
    .fn()
    .mockResolvedValue(left(new NFeTsError('stop')));

  protected override event = this.eventMock as never;
}

class FlowPipeline extends NfeRtcEventPipeline {
  public readonly eventMock = jest.fn().mockResolvedValue(right(signedEvento));
  public readonly recepcaoEventoMock = jest
    .fn()
    .mockResolvedValue(lote(retEventoSuccess));

  protected override readonly transmitter = {
    recepcaoEvento: this.recepcaoEventoMock,
  } as unknown as NfeRtcEventPipeline['transmitter'];

  protected override event = this.eventMock as never;
}

const rtcTpEvents = [
  TpEvent.CancelamentoEventoRtc,
  TpEvent.InfoPagtoIntegralRtc,
  TpEvent.ImportacaoZfmRtc,
  TpEvent.PerecimentoTransporteFornecedorRtc,
  TpEvent.FornecimentoNaoRealizadoRtc,
  TpEvent.AtualizacaoDataEntregaRtc,
  TpEvent.SolApropCredPresumidoRtc,
  TpEvent.DestinoConsumoPessoalRtc,
  TpEvent.PerecimentoTransporteAdquirenteRtc,
  TpEvent.AceiteDebitoRtc,
  TpEvent.ImobilizacaoItemRtc,
  TpEvent.ApropCreditoCombustivelRtc,
  TpEvent.ApropCreditoBensRtc,
  TpEvent.ManifestacaoTransfCredIbsRtc,
  TpEvent.ManifestacaoTransfCredCbsRtc,
  TpEvent.ManifestacaoFiscoTransfCredIbsRtc,
  TpEvent.ManifestacaoFiscoTransfCredCbsRtc,
] as const;

describe('nfe rtc event pipeline (unit)', () => {
  it('should use nfe remote transmitter', () => {
    class Exposed extends NfeRtcEventPipeline {
      public get transmitterRef() {
        return this.transmitter;
      }
    }

    expect(new Exposed(certificate).transmitterRef).toBeInstanceOf(
      NfeRemoteTransmitter,
    );
  });

  it('should map cOrgao 92 to SVRS webservice', () => {
    expect(webservices[92]).toBe('SVRS');
  });

  it.each(rtcTpEvents)(
    'should register version and descEvento for %s',
    (tpEvento) => {
      expect(events[tpEvento]).toEqual(
        expect.objectContaining({
          method: 'envEvento',
          version: '1.00',
          descEvento: expect.any(String),
        }),
      );
      expect(events[tpEvento].descEvento.length).toBeGreaterThan(0);
    },
  );

  describe('transmit shared behavior', () => {
    it('should reject non-model-55 chave', async () => {
      const pipeline = new NfeRtcEventPipeline(certificate);
      const result = await pipeline.infoPagtoIntegral(
        { ...base, chNFe: chNFe65 },
        options,
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as NFeTsError).message).toContain('modelo 55');
    });

    it('should send cOrgao 92, default nSeqEvento and build procEventoNFe', async () => {
      const pipeline = new FlowPipeline(certificate);
      const result = await pipeline.infoPagtoIntegral(base, options);

      expect(result.isRight()).toBe(true);
      expect(pipeline.eventMock).toHaveBeenCalledWith(
        TpEvent.InfoPagtoIntegralRtc,
        expect.objectContaining({
          chNFe,
          identification,
          cOrgao: '92',
          nSeqEvento: 1,
          detEvento: expect.objectContaining({
            cOrgaoAutor: '35',
            tpAutor: TpAutorRtc.Emitente,
            verAplic: '4.00',
            indQuitacao: '1',
          }),
        }),
        options,
      );
      expect(pipeline.recepcaoEventoMock).toHaveBeenCalledWith(
        expect.objectContaining({
          idLote: expect.any(String),
          evento: signedEvento,
        }),
      );

      const { xml, response } = result.value as {
        xml: string;
        response: { retEnvEvento: { cStat: string } };
      };
      expect(response.retEnvEvento.cStat).toBe('128');
      expect(xml).toContain('<procEventoNFe');
      expect(xml).toContain('<cStat>135</cStat>');
    });

    it('should forward nSeqEvento, idLote, dhEvento and verAplic', async () => {
      const pipeline = new FlowPipeline(certificate);

      await pipeline.infoPagtoIntegral(
        {
          ...base,
          nSeqEvento: 3,
          idLote: 'lote-rtc',
          dhEvento: '2025-12-22T18:40:33-03:00',
          verAplic: '5.00',
        },
        options,
      );

      expect(pipeline.eventMock).toHaveBeenCalledWith(
        TpEvent.InfoPagtoIntegralRtc,
        expect.objectContaining({
          nSeqEvento: 3,
          dhEvento: '2025-12-22T18:40:33-03:00',
          detEvento: expect.objectContaining({ verAplic: '5.00' }),
        }),
        options,
      );
      expect(pipeline.recepcaoEventoMock).toHaveBeenCalledWith(
        expect.objectContaining({ idLote: 'lote-rtc' }),
      );
    });

    it('should return evento xml without procEventoNFe when rejected', async () => {
      class Rejected extends NfeRtcEventPipeline {
        protected override event = jest
          .fn()
          .mockResolvedValue(right(signedEvento)) as never;

        protected override readonly transmitter = {
          recepcaoEvento: jest
            .fn()
            .mockResolvedValue(lote(retEventoRejected)),
        } as unknown as NfeRtcEventPipeline['transmitter'];
      }

      const result = await new Rejected(certificate).infoPagtoIntegral(
        base,
        options,
      );

      expect(result.isRight()).toBe(true);
      const { xml } = result.value as { xml: string };
      expect(xml).toContain('<evento');
      expect(xml).not.toContain('<procEventoNFe');
    });

    it('should return left when retEvento is missing', async () => {
      class MissingRet extends NfeRtcEventPipeline {
        protected override event = jest
          .fn()
          .mockResolvedValue(right(signedEvento)) as never;

        protected override readonly transmitter = {
          recepcaoEvento: jest.fn().mockResolvedValue(lote()),
        } as unknown as NfeRtcEventPipeline['transmitter'];
      }

      const result = await new MissingRet(certificate).infoPagtoIntegral(
        base,
        options,
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as NFeTsError).message).toBe(
        'Evento RTC não retornado pela SEFAZ',
      );
    });

    it('should return left when event creation fails', async () => {
      class EventFail extends NfeRtcEventPipeline {
        public readonly recepcaoEventoMock = jest.fn();

        protected override event = jest
          .fn()
          .mockResolvedValue(left(new NFeTsError('event error'))) as never;

        protected override readonly transmitter = {
          recepcaoEvento: this.recepcaoEventoMock,
        } as unknown as NfeRtcEventPipeline['transmitter'];
      }

      const pipeline = new EventFail(certificate);
      const result = await pipeline.infoPagtoIntegral(base, options);

      expect(result.isLeft()).toBe(true);
      expect(pipeline.recepcaoEventoMock).not.toHaveBeenCalled();
    });

    it('should return left when recepcaoEvento fails', async () => {
      class RecepcaoFail extends NfeRtcEventPipeline {
        protected override event = jest
          .fn()
          .mockResolvedValue(right(signedEvento)) as never;

        protected override readonly transmitter = {
          recepcaoEvento: jest
            .fn()
            .mockResolvedValue(left(new NFeTsError('sefaz down'))),
        } as unknown as NfeRtcEventPipeline['transmitter'];
      }

      const result = await new RecepcaoFail(certificate).infoPagtoIntegral(
        base,
        options,
      );

      expect(result.isLeft()).toBe(true);
      expect((result.value as NFeTsError).message).toBe('sefaz down');
    });

    it('should configure transmitter with cUF 92 when building the event', async () => {
      class ConfigurePipeline extends NfeRtcEventPipeline {
        public readonly configureMock = jest.fn();
        public readonly signMock = jest
          .fn()
          .mockImplementation((payload) => Promise.resolve(right(payload)));

        protected override readonly certificates = {
          read: jest.fn().mockResolvedValue(right({ certificate: 'mock' })),
        } as unknown as NfeRtcEventPipeline['certificates'];

        protected override readonly signer = {
          sign: this.signMock,
        } as unknown as NfeRtcEventPipeline['signer'];

        protected override readonly transmitter = {
          configure: this.configureMock,
          recepcaoEvento: jest.fn().mockResolvedValue(lote(retEventoSuccess)),
        } as unknown as NfeRtcEventPipeline['transmitter'];
      }

      const pipeline = new ConfigurePipeline(certificate);
      const result = await pipeline.infoPagtoIntegral(base, options);

      expect(result.isRight()).toBe(true);
      expect(pipeline.configureMock).toHaveBeenCalledWith(
        expect.objectContaining({ cUF: '92' }),
      );
      expect(pipeline.signMock).toHaveBeenCalledWith(
        expect.objectContaining({
          infEvento: expect.objectContaining({
            cOrgao: '92',
            tpEvento: TpEvent.InfoPagtoIntegralRtc,
            detEvento: expect.objectContaining({
              descEvento: events[TpEvent.InfoPagtoIntegralRtc].descEvento,
              indQuitacao: '1',
            }),
          }),
        }),
        expect.anything(),
        expect.anything(),
      );
    });
  });

  describe('detEvento mapping', () => {
    it('infoPagtoIntegral', async () => {
      const pipeline = new MappingPipeline(certificate);
      await pipeline.infoPagtoIntegral(base, options);

      expect(pipeline.eventMock).toHaveBeenCalledWith(
        TpEvent.InfoPagtoIntegralRtc,
        expect.objectContaining({
          cOrgao: '92',
          detEvento: {
            cOrgaoAutor: '35',
            tpAutor: TpAutorRtc.Emitente,
            verAplic: '4.00',
            indQuitacao: '1',
          },
        }),
        options,
      );
    });

    it('importacaoZfm', async () => {
      const pipeline = new MappingPipeline(certificate);
      await pipeline.importacaoZfm({ ...base, itens: [itemBase] }, options);

      expect(pipeline.eventMock).toHaveBeenCalledWith(
        TpEvent.ImportacaoZfmRtc,
        expect.objectContaining({
          detEvento: expect.objectContaining({
            tpAutor: TpAutorRtc.Emitente,
            gConsumo: [
              {
                $: { nItem: '1' },
                vIBS: '10.00',
                vCBS: '20.00',
                gControleEstoque: { qtde: '1.0000', unidade: 'UN' },
              },
            ],
          }),
        }),
        options,
      );
    });

    it('perecimentoTransporteFornecedor', async () => {
      const pipeline = new MappingPipeline(certificate);
      await pipeline.perecimentoTransporteFornecedor(
        {
          ...base,
          itens: [
            { ...itemBase, vIBSEstoque: '1.00', vCBSEstoque: '2.00' },
          ],
        },
        options,
      );

      expect(pipeline.eventMock).toHaveBeenCalledWith(
        TpEvent.PerecimentoTransporteFornecedorRtc,
        expect.objectContaining({
          detEvento: expect.objectContaining({
            tpAutor: TpAutorRtc.Emitente,
            gPerecimento: [
              {
                $: { nItem: '1' },
                vIBS: '10.00',
                vCBS: '20.00',
                gControleEstoque: {
                  qPerecimento: '1.0000',
                  uPerecimento: 'UN',
                  vIBS: '1.00',
                  vCBS: '2.00',
                },
              },
            ],
          }),
        }),
        options,
      );
    });

    it('fornecimentoNaoRealizado', async () => {
      const pipeline = new MappingPipeline(certificate);
      await pipeline.fornecimentoNaoRealizado(
        { ...base, itens: [itemBase] },
        options,
      );

      expect(pipeline.eventMock).toHaveBeenCalledWith(
        TpEvent.FornecimentoNaoRealizadoRtc,
        expect.objectContaining({
          detEvento: expect.objectContaining({
            tpAutor: TpAutorRtc.Emitente,
            gItemNaoFornecido: [
              {
                $: { nItem: '1' },
                vIBS: '10.00',
                vCBS: '20.00',
                gControleEstoque: {
                  qNaoFornecida: '1.0000',
                  uNaoFornecida: 'UN',
                },
              },
            ],
          }),
        }),
        options,
      );
    });

    it('atualizacaoDataEntrega', async () => {
      const pipeline = new MappingPipeline(certificate);
      await pipeline.atualizacaoDataEntrega(
        { ...base, dPrevEntrega: '2026-01-15' },
        options,
      );

      expect(pipeline.eventMock).toHaveBeenCalledWith(
        TpEvent.AtualizacaoDataEntregaRtc,
        expect.objectContaining({
          detEvento: {
            cOrgaoAutor: '35',
            tpAutor: TpAutorRtc.Emitente,
            verAplic: '4.00',
            dPrevEntrega: '2026-01-15',
          },
        }),
        options,
      );
    });

    it('solApropCredPresumido with optional groups', async () => {
      const pipeline = new MappingPipeline(certificate);
      await pipeline.solApropCredPresumido(
        {
          ...base,
          tpAutor: TpAutorRtc.Destinatario,
          itens: [
            {
              nItem: '1',
              vBCCredPres: '100.00',
              cCredPres: '01',
              gIBSCredPres: { pCredPres: '2.5000', vCredPres: '2.50' },
            },
            {
              nItem: '2',
              vBCCredPres: '200.00',
              cCredPres: '02',
              gCBSCredPres: { pCredPres: '1.0000', vCredPres: '2.00' },
            },
          ],
        },
        options,
      );

      expect(pipeline.eventMock).toHaveBeenCalledWith(
        TpEvent.SolApropCredPresumidoRtc,
        expect.objectContaining({
          detEvento: expect.objectContaining({
            tpAutor: TpAutorRtc.Destinatario,
            gCredPresOper: [
              {
                $: { nItem: '1' },
                vBCCredPres: '100.00',
                cCredPres: '01',
                gIBSCredPres: { pCredPres: '2.5000', vCredPres: '2.50' },
                gCBSCredPres: undefined,
              },
              {
                $: { nItem: '2' },
                vBCCredPres: '200.00',
                cCredPres: '02',
                gIBSCredPres: undefined,
                gCBSCredPres: { pCredPres: '1.0000', vCredPres: '2.00' },
              },
            ],
          }),
        }),
        options,
      );
    });

    it('destinoConsumoPessoal', async () => {
      const pipeline = new MappingPipeline(certificate);
      await pipeline.destinoConsumoPessoal(
        {
          ...base,
          tpAutor: TpAutorRtc.Emitente,
          itens: [
            {
              ...itemBase,
              chaveAcesso: chNFe,
              nItemRef: '2',
            },
          ],
        },
        options,
      );

      expect(pipeline.eventMock).toHaveBeenCalledWith(
        TpEvent.DestinoConsumoPessoalRtc,
        expect.objectContaining({
          detEvento: expect.objectContaining({
            tpAutor: TpAutorRtc.Emitente,
            gConsumo: [
              {
                $: { nItem: '1' },
                vIBS: '10.00',
                vCBS: '20.00',
                gControleEstoque: {
                  qConsumo: '1.0000',
                  uConsumo: 'UN',
                },
                DFeReferenciado: {
                  chaveAcesso: chNFe,
                  nItem: '2',
                },
              },
            ],
          }),
        }),
        options,
      );
    });

    it('perecimentoTransporteAdquirente', async () => {
      const pipeline = new MappingPipeline(certificate);
      await pipeline.perecimentoTransporteAdquirente(
        { ...base, itens: [itemBase] },
        options,
      );

      expect(pipeline.eventMock).toHaveBeenCalledWith(
        TpEvent.PerecimentoTransporteAdquirenteRtc,
        expect.objectContaining({
          detEvento: expect.objectContaining({
            tpAutor: TpAutorRtc.Destinatario,
            gPerecimento: [
              {
                $: { nItem: '1' },
                vIBS: '10.00',
                vCBS: '20.00',
                gControleEstoque: {
                  qPerecimento: '1.0000',
                  uPerecimento: 'UN',
                },
              },
            ],
          }),
        }),
        options,
      );
    });

    it('aceiteDebito', async () => {
      const pipeline = new MappingPipeline(certificate);
      await pipeline.aceiteDebito(
        { ...base, indAceitacao: '1' },
        options,
      );

      expect(pipeline.eventMock).toHaveBeenCalledWith(
        TpEvent.AceiteDebitoRtc,
        expect.objectContaining({
          detEvento: {
            cOrgaoAutor: '35',
            tpAutor: TpAutorRtc.Destinatario,
            verAplic: '4.00',
            indAceitacao: '1',
          },
        }),
        options,
      );
    });

    it('imobilizacaoItem', async () => {
      const pipeline = new MappingPipeline(certificate);
      await pipeline.imobilizacaoItem({ ...base, itens: [itemBase] }, options);

      expect(pipeline.eventMock).toHaveBeenCalledWith(
        TpEvent.ImobilizacaoItemRtc,
        expect.objectContaining({
          detEvento: expect.objectContaining({
            tpAutor: TpAutorRtc.Destinatario,
            gImobilizacao: [
              {
                $: { nItem: '1' },
                vIBS: '10.00',
                vCBS: '20.00',
                gControleEstoque: {
                  qImobilizado: '1.0000',
                  uImobilizado: 'UN',
                },
              },
            ],
          }),
        }),
        options,
      );
    });

    it('apropCreditoCombustivel', async () => {
      const pipeline = new MappingPipeline(certificate);
      await pipeline.apropCreditoCombustivel(
        { ...base, itens: [{ ...itemBase, unidade: 'LT' }] },
        options,
      );

      expect(pipeline.eventMock).toHaveBeenCalledWith(
        TpEvent.ApropCreditoCombustivelRtc,
        expect.objectContaining({
          detEvento: expect.objectContaining({
            tpAutor: TpAutorRtc.Destinatario,
            gConsumoComb: [
              {
                $: { nItem: '1' },
                vIBS: '10.00',
                vCBS: '20.00',
                gControleEstoque: { qComb: '1.0000', uComb: 'LT' },
              },
            ],
          }),
        }),
        options,
      );
    });

    it('apropCreditoBens', async () => {
      const pipeline = new MappingPipeline(certificate);
      await pipeline.apropCreditoBens(
        {
          ...base,
          itens: [{ nItem: '1', vCredIBS: '3.00', vCredCBS: '4.00' }],
        },
        options,
      );

      expect(pipeline.eventMock).toHaveBeenCalledWith(
        TpEvent.ApropCreditoBensRtc,
        expect.objectContaining({
          detEvento: expect.objectContaining({
            tpAutor: TpAutorRtc.Destinatario,
            gCredito: [
              {
                $: { nItem: '1' },
                vCredIBS: '3.00',
                vCredCBS: '4.00',
              },
            ],
          }),
        }),
        options,
      );
    });

    it('manifestacaoTransfCredIbs', async () => {
      const pipeline = new MappingPipeline(certificate);
      await pipeline.manifestacaoTransfCredIbs(
        { ...base, indAceitacao: '0' },
        options,
      );

      expect(pipeline.eventMock).toHaveBeenCalledWith(
        TpEvent.ManifestacaoTransfCredIbsRtc,
        expect.objectContaining({
          detEvento: {
            cOrgaoAutor: '35',
            tpAutor: TpAutorRtc.Sucessora,
            verAplic: '4.00',
            indAceitacao: '0',
          },
        }),
        options,
      );
    });

    it('manifestacaoTransfCredCbs', async () => {
      const pipeline = new MappingPipeline(certificate);
      await pipeline.manifestacaoTransfCredCbs(
        { ...base, indAceitacao: '1' },
        options,
      );

      expect(pipeline.eventMock).toHaveBeenCalledWith(
        TpEvent.ManifestacaoTransfCredCbsRtc,
        expect.objectContaining({
          detEvento: expect.objectContaining({
            tpAutor: TpAutorRtc.Sucessora,
            indAceitacao: '1',
          }),
        }),
        options,
      );
    });

    it('cancelaEvento', async () => {
      const pipeline = new MappingPipeline(certificate);
      await pipeline.cancelaEvento(
        {
          ...base,
          tpEventoAut: TpEvent.InfoPagtoIntegralRtc,
          nProtEvento: '135240000000099',
        },
        options,
      );

      expect(pipeline.eventMock).toHaveBeenCalledWith(
        TpEvent.CancelamentoEventoRtc,
        expect.objectContaining({
          detEvento: {
            cOrgaoAutor: '35',
            verAplic: '4.00',
            tpEventoAut: TpEvent.InfoPagtoIntegralRtc,
            nProtEvento: '135240000000099',
          },
        }),
        options,
      );
    });

    it('cancelaEvento keeps custom verAplic', async () => {
      const pipeline = new MappingPipeline(certificate);
      await pipeline.cancelaEvento(
        {
          ...base,
          verAplic: '9.99',
          tpEventoAut: TpEvent.AceiteDebitoRtc,
          nProtEvento: '1',
        },
        options,
      );

      expect(pipeline.eventMock).toHaveBeenCalledWith(
        TpEvent.CancelamentoEventoRtc,
        expect.objectContaining({
          detEvento: expect.objectContaining({ verAplic: '9.99' }),
        }),
        options,
      );
    });

    it('manifestacaoFiscoTransfCredIbs', async () => {
      const pipeline = new MappingPipeline(certificate);
      await pipeline.manifestacaoFiscoTransfCredIbs(
        {
          ...base,
          indDeferimento: '1',
          cMotivo: '2',
          xMotivo: 'Deferido pelo fisco',
        },
        options,
      );

      expect(pipeline.eventMock).toHaveBeenCalledWith(
        TpEvent.ManifestacaoFiscoTransfCredIbsRtc,
        expect.objectContaining({
          detEvento: {
            cOrgaoAutor: '35',
            tpAutor: TpAutorRtc.Fisco,
            verAplic: '4.00',
            indDeferimento: '1',
            cMotivo: '2',
            xMotivo: 'Deferido pelo fisco',
          },
        }),
        options,
      );
    });

    it('manifestacaoFiscoTransfCredCbs', async () => {
      const pipeline = new MappingPipeline(certificate);
      await pipeline.manifestacaoFiscoTransfCredCbs(
        {
          ...base,
          indDeferimento: '0',
          cMotivo: '1',
          xMotivo: 'Indeferido',
        },
        options,
      );

      expect(pipeline.eventMock).toHaveBeenCalledWith(
        TpEvent.ManifestacaoFiscoTransfCredCbsRtc,
        expect.objectContaining({
          detEvento: expect.objectContaining({
            tpAutor: TpAutorRtc.Fisco,
            indDeferimento: '0',
            cMotivo: '1',
            xMotivo: 'Indeferido',
          }),
        }),
        options,
      );
    });
  });
});
