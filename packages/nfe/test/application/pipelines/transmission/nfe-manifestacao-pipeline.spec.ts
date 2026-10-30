import { NfeManifestacaoPipeline } from '@nfets/nfe/application/pipelines/transmission/nfe-manifestacao-pipeline';
import { NfeRemoteTransmitter } from '@nfets/nfe/application/transmission/nfe-transmitter';
import { Environment } from '@nfets/core/domain';
import { left, right } from '@nfets/core/shared';
import { NFeTsError } from '@nfets/core';
import { TpEvent } from '@nfets/nfe/domain/entities/constants/tp-event';

const chNFe = '35240100000000000000550010000000011000000010';
const identification = 'N4BW1CV0000100';

const signedEvento = {
  $: { xmlns: 'http://www.portalfiscal.inf.br/nfe' },
  infEvento: {
    $: { Id: `ID${TpEvent.CienciaOperacao}${chNFe}01` },
    cOrgao: '91',
    tpAmb: Environment.Homolog,
    CNPJ: identification,
    chNFe,
    dhEvento: '2025-12-22T18:40:33.060Z',
    tpEvento: TpEvent.CienciaOperacao,
    nSeqEvento: 1,
    verEvento: '1.00',
    detEvento: {
      $: { versao: '1.00' },
      descEvento: 'Ciencia da Operacao',
    },
  },
};

const retEventoSuccess = {
  $: { versao: '1.00' },
  infEvento: {
    tpAmb: '2',
    verAplic: 'AN_1.1.9',
    cOrgao: '91',
    cStat: '135',
    xMotivo: 'Evento registrado e vinculado a NF-e',
    chNFe,
    tpEvento: TpEvent.CienciaOperacao,
    nSeqEvento: '1',
    CNPJDest: identification,
    dhRegEvento: '2025-12-22T18:40:33.060Z',
    nProt: '891250000000001',
  },
};

const retEventoRejected = {
  $: { versao: '1.00' },
  infEvento: {
    tpAmb: '2',
    verAplic: 'AN_1.1.9',
    cOrgao: '91',
    cStat: '573',
    xMotivo: 'Rejeicao: Duplicidade de Evento',
    dhRegEvento: '2025-12-22T18:40:33.060Z',
  },
};

const lote = (retEvento?: unknown) =>
  right({
    retEnvEvento: {
      cStat: '128',
      xMotivo: 'Lote de evento processado',
      ...(retEvento ? { retEvento } : {}),
    },
  });

const certificate = { pfxPathOrBase64: 'mock', password: 'mock' };

describe('nfe manifestacao pipeline (unit)', () => {
  it('should use nfe remote transmitter', () => {
    class NfeManifestacaoPipelineExposed extends NfeManifestacaoPipeline {
      public get transmitterRef() {
        return this.transmitter;
      }
    }

    const pipeline = new NfeManifestacaoPipelineExposed(certificate);

    expect(pipeline.transmitterRef).toBeInstanceOf(NfeRemoteTransmitter);
  });

  it('should send ciencia to ambiente nacional and return procEventoNFe xml', async () => {
    class MockableNfeManifestacaoPipeline extends NfeManifestacaoPipeline {
      public readonly eventMock = jest
        .fn()
        .mockResolvedValue(right(signedEvento));

      public readonly recepcaoEventoMock = jest
        .fn()
        .mockResolvedValue(lote(retEventoSuccess));

      protected override readonly transmitter = {
        recepcaoEvento: this.recepcaoEventoMock,
      } as unknown as NfeManifestacaoPipeline['transmitter'];

      protected override event = this.eventMock as never;
    }

    const pipeline = new MockableNfeManifestacaoPipeline(certificate);

    const result = await pipeline.execute(
      { chNFe, identification, tpEvento: TpEvent.CienciaOperacao },
      { tpAmb: Environment.Homolog },
    );

    expect(result.isRight()).toBe(true);
    expect(pipeline.eventMock).toHaveBeenCalledWith(
      TpEvent.CienciaOperacao,
      expect.objectContaining({
        chNFe,
        identification,
        nSeqEvento: 1,
        cOrgao: '91',
        detEvento: {},
      }),
      { tpAmb: Environment.Homolog },
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

  it('should send xJust, nSeqEvento, idLote and dhEvento when informed', async () => {
    class MockableNfeManifestacaoPipeline extends NfeManifestacaoPipeline {
      public readonly eventMock = jest
        .fn()
        .mockResolvedValue(right(signedEvento));

      public readonly recepcaoEventoMock = jest
        .fn()
        .mockResolvedValue(lote(retEventoSuccess));

      protected override readonly transmitter = {
        recepcaoEvento: this.recepcaoEventoMock,
      } as unknown as NfeManifestacaoPipeline['transmitter'];

      protected override event = this.eventMock as never;
    }

    const pipeline = new MockableNfeManifestacaoPipeline(certificate);

    await pipeline.execute(
      {
        chNFe,
        identification,
        tpEvento: TpEvent.OperacaoNaoRealizada,
        xJust: 'Mercadoria nao foi entregue',
        nSeqEvento: 2,
        idLote: '123',
        dhEvento: '2025-12-22T18:40:33-03:00',
      },
      { tpAmb: Environment.Homolog },
    );

    expect(pipeline.eventMock).toHaveBeenCalledWith(
      TpEvent.OperacaoNaoRealizada,
      expect.objectContaining({
        nSeqEvento: 2,
        dhEvento: '2025-12-22T18:40:33-03:00',
        detEvento: { xJust: 'Mercadoria nao foi entregue' },
      }),
      { tpAmb: Environment.Homolog },
    );
    expect(pipeline.recepcaoEventoMock).toHaveBeenCalledWith(
      expect.objectContaining({ idLote: '123' }),
    );
  });

  it('should return evento xml without procEventoNFe when event is rejected', async () => {
    class MockableNfeManifestacaoPipeline extends NfeManifestacaoPipeline {
      protected override readonly transmitter = {
        recepcaoEvento: jest.fn().mockResolvedValue(lote(retEventoRejected)),
      } as unknown as NfeManifestacaoPipeline['transmitter'];

      protected override event = jest
        .fn()
        .mockResolvedValue(right(signedEvento)) as never;
    }

    const pipeline = new MockableNfeManifestacaoPipeline(certificate);

    const result = await pipeline.execute(
      { chNFe, identification, tpEvento: TpEvent.CienciaOperacao },
      { tpAmb: Environment.Homolog },
    );

    expect(result.isRight()).toBe(true);
    const { xml } = result.value as { xml: string };
    expect(xml).toContain('<evento');
    expect(xml).not.toContain('<procEventoNFe');
  });

  it('should return left when retEvento is missing', async () => {
    class MockableNfeManifestacaoPipeline extends NfeManifestacaoPipeline {
      protected override readonly transmitter = {
        recepcaoEvento: jest.fn().mockResolvedValue(lote()),
      } as unknown as NfeManifestacaoPipeline['transmitter'];

      protected override event = jest
        .fn()
        .mockResolvedValue(right(signedEvento)) as never;
    }

    const pipeline = new MockableNfeManifestacaoPipeline(certificate);

    const result = await pipeline.execute(
      { chNFe, identification, tpEvento: TpEvent.CienciaOperacao },
      { tpAmb: Environment.Homolog },
    );

    expect(result.isLeft()).toBe(true);
    expect((result.value as NFeTsError).message).toBe(
      'Evento de manifestação não retornado',
    );
  });

  it('should return left when event creation fails', async () => {
    class MockableNfeManifestacaoPipeline extends NfeManifestacaoPipeline {
      public readonly recepcaoEventoMock = jest.fn();

      protected override readonly transmitter = {
        recepcaoEvento: this.recepcaoEventoMock,
      } as unknown as NfeManifestacaoPipeline['transmitter'];

      protected override event = jest
        .fn()
        .mockResolvedValue(left(new NFeTsError('event error'))) as never;
    }

    const pipeline = new MockableNfeManifestacaoPipeline(certificate);

    const result = await pipeline.execute(
      { chNFe, identification, tpEvento: TpEvent.CienciaOperacao },
      { tpAmb: Environment.Homolog },
    );

    expect(result.isLeft()).toBe(true);
    expect(pipeline.recepcaoEventoMock).not.toHaveBeenCalled();
  });

  it('should configure cUF 91 and sign the event with the ciencia description', async () => {
    class MockableNfeManifestacaoPipeline extends NfeManifestacaoPipeline {
      public readonly signMock = jest
        .fn()
        .mockImplementation((payload) => Promise.resolve(right(payload)));

      public readonly configureMock = jest.fn();

      protected override readonly certificates = {
        read: jest.fn().mockResolvedValue(right({ certificate: 'mock' })),
      } as unknown as NfeManifestacaoPipeline['certificates'];

      protected override readonly signer = {
        sign: this.signMock,
      } as unknown as NfeManifestacaoPipeline['signer'];

      protected override readonly transmitter = {
        configure: this.configureMock,
        recepcaoEvento: jest.fn().mockResolvedValue(lote(retEventoSuccess)),
      } as unknown as NfeManifestacaoPipeline['transmitter'];
    }

    const pipeline = new MockableNfeManifestacaoPipeline(certificate);

    const result = await pipeline.execute(
      { chNFe, identification, tpEvento: TpEvent.CienciaOperacao },
      { tpAmb: Environment.Homolog },
    );

    expect(result.isRight()).toBe(true);
    expect(pipeline.configureMock).toHaveBeenCalledWith(
      expect.objectContaining({ cUF: '91' }),
    );
    expect(pipeline.signMock).toHaveBeenCalledWith(
      expect.objectContaining({
        infEvento: expect.objectContaining({
          cOrgao: '91',
          CNPJ: identification,
          tpEvento: TpEvent.CienciaOperacao,
          detEvento: {
            $: { versao: '1.00' },
            descEvento: 'Ciencia da Operacao',
          },
        }),
      }),
      expect.anything(),
      expect.anything(),
    );
  });
});
