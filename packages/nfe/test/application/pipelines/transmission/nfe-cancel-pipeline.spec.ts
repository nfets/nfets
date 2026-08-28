import { NfeCancelPipeline } from '@nfets/nfe/application/pipelines/transmission/nfe-cancel-pipeline';
import { NfeRemoteTransmitter } from '@nfets/nfe/application/transmission/nfe-transmitter';
import { Environment } from '@nfets/core/domain';
import { left, right } from '@nfets/core/shared';
import { NFeTsError } from '@nfets/core';
import { TpEvent } from '@nfets/nfe/domain/entities/constants/tp-event';

const chNFe = '35240100000000000000550010000000011000000010';
const identification = '03916076000664';

const signedEvento = {
  $: { xmlns: 'http://www.portalfiscal.inf.br/nfe' },
  infEvento: {
    $: { Id: `ID${TpEvent.Cancelamento}${chNFe}01` },
    cOrgao: '35',
    tpAmb: Environment.Homolog,
    CNPJ: identification,
    chNFe,
    dhEvento: '2025-12-22T18:40:33.060Z',
    tpEvento: TpEvent.Cancelamento,
    nSeqEvento: 1,
    verEvento: '1.00',
    detEvento: {
      $: { versao: '1.00' },
      descEvento: 'Cancelamento',
      nProt: '135240000000001',
      xJust: 'Cancelamento de teste',
    },
  },
};

const retEventoSuccess = {
  $: { versao: '1.00' },
  infEvento: {
    tpAmb: '2',
    verAplic: '1.0',
    cOrgao: '35',
    cStat: '135',
    xMotivo: 'Evento registrado e vinculado a NF-e',
    chNFe,
    tpEvento: TpEvent.Cancelamento,
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
    cOrgao: '35',
    cStat: '573',
    xMotivo: 'Rejeicao: Duplicidade de Evento',
    dhRegEvento: '2025-12-22T18:40:33.060Z',
  },
};

describe('nfe cancel pipeline (unit)', () => {
  it('should use nfe remote transmitter', () => {
    class NfeCancelPipelineExposed extends NfeCancelPipeline {
      public get transmitterRef() {
        return this.transmitter;
      }
    }

    const pipeline = new NfeCancelPipelineExposed({
      pfxPathOrBase64: 'mock',
      password: 'mock',
    });

    expect(pipeline.transmitterRef).toBeInstanceOf(NfeRemoteTransmitter);
  });

  it('should execute cancellation and return procEventoNFe xml', async () => {
    class MockableNfeCancelPipeline extends NfeCancelPipeline {
      public readonly eventMock = jest
        .fn()
        .mockResolvedValue(right(signedEvento));

      protected override readonly transmitter = {
        recepcaoEvento: jest.fn().mockResolvedValue(
          right({
            retEnvEvento: {
              cStat: '128',
              xMotivo: 'Lote de Evento Processado',
              retEvento: retEventoSuccess,
            },
          }),
        ),
      } as unknown as NfeCancelPipeline['transmitter'];

      protected override event = this.eventMock as never;
    }

    const pipeline = new MockableNfeCancelPipeline({
      pfxPathOrBase64: 'mock',
      password: 'mock',
    });

    const result = await pipeline.execute(
      {
        chNFe,
        identification,
        nProt: '135240000000001',
        xJust: 'Cancelamento de teste',
      },
      { tpAmb: Environment.Homolog },
    );

    expect(result.isRight()).toBe(true);
    expect(pipeline.eventMock).toHaveBeenCalledWith(
      TpEvent.Cancelamento,
      expect.objectContaining({
        chNFe,
        nSeqEvento: 1,
        identification,
      }),
      { tpAmb: Environment.Homolog },
    );
    expect(pipeline.transmitter.recepcaoEvento).toHaveBeenCalledWith(
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
    expect(xml).toContain('<evento');
    expect(xml).toContain('<retEvento');
    expect(xml).toContain('<cStat>135</cStat>');
  });

  it('should return evento xml without procEventoNFe when event is rejected', async () => {
    class MockableNfeCancelPipeline extends NfeCancelPipeline {
      protected override readonly transmitter = {
        recepcaoEvento: jest.fn().mockResolvedValue(
          right({
            retEnvEvento: {
              cStat: '128',
              xMotivo: 'Lote de Evento Processado',
              retEvento: retEventoRejected,
            },
          }),
        ),
      } as unknown as NfeCancelPipeline['transmitter'];

      protected override event = jest
        .fn()
        .mockResolvedValue(right(signedEvento)) as never;
    }

    const pipeline = new MockableNfeCancelPipeline({
      pfxPathOrBase64: 'mock',
      password: 'mock',
    });

    const result = await pipeline.execute(
      {
        chNFe,
        identification,
        nProt: '135240000000001',
        xJust: 'Cancelamento de teste',
      },
      { tpAmb: Environment.Homolog },
    );

    expect(result.isRight()).toBe(true);
    const { xml } = result.value as { xml: string };
    expect(xml).toContain('<evento');
    expect(xml).not.toContain('<procEventoNFe');
    expect(xml).not.toContain('<retEvento');
  });

  it('should return left when retEvento is missing', async () => {
    class MockableNfeCancelPipeline extends NfeCancelPipeline {
      protected override readonly transmitter = {
        recepcaoEvento: jest.fn().mockResolvedValue(
          right({
            retEnvEvento: {
              cStat: '128',
              xMotivo: 'Lote de Evento Processado',
            },
          }),
        ),
      } as unknown as NfeCancelPipeline['transmitter'];

      protected override event = jest
        .fn()
        .mockResolvedValue(right(signedEvento)) as never;
    }

    const pipeline = new MockableNfeCancelPipeline({
      pfxPathOrBase64: 'mock',
      password: 'mock',
    });

    const result = await pipeline.execute(
      {
        chNFe,
        identification,
        nProt: '135240000000001',
        xJust: 'Cancelamento de teste',
      },
      { tpAmb: Environment.Homolog },
    );

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NFeTsError);
  });

  it('should return left when event creation fails', async () => {
    class MockableNfeCancelPipeline extends NfeCancelPipeline {
      protected override readonly transmitter = {
        recepcaoEvento: jest.fn(),
      } as unknown as NfeCancelPipeline['transmitter'];

      protected override event = jest
        .fn()
        .mockResolvedValue(left(new NFeTsError('event error'))) as never;
    }

    const pipeline = new MockableNfeCancelPipeline({
      pfxPathOrBase64: 'mock',
      password: 'mock',
    });

    const result = await pipeline.execute(
      {
        chNFe,
        identification,
        nProt: '135240000000001',
        xJust: 'Cancelamento de teste',
      },
      { tpAmb: Environment.Homolog },
    );

    expect(result.isLeft()).toBe(true);
    expect(pipeline.transmitter.recepcaoEvento).not.toHaveBeenCalled();
  });

  it('should use branch identification instead of certificate CNPJ', async () => {
    class MockableNfeCancelPipeline extends NfeCancelPipeline {
      public readonly signMock = jest
        .fn()
        .mockImplementation((payload) => Promise.resolve(right(payload)));

      protected override readonly certificates = {
        read: jest.fn().mockResolvedValue(
          right({
            certificate: 'mock-certificate',
          }),
        ),
        getCertificateInfo: jest.fn().mockReturnValue({
          CNPJ: '12345678000190',
        }),
      } as unknown as NfeCancelPipeline['certificates'];

      protected override readonly signer = {
        sign: this.signMock,
      } as unknown as NfeCancelPipeline['signer'];

      protected override readonly transmitter = {
        configure: jest.fn(),
        recepcaoEvento: jest.fn().mockResolvedValue(
          right({
            retEnvEvento: {
              cStat: '128',
              xMotivo: 'Lote de Evento Processado',
              retEvento: retEventoSuccess,
            },
          }),
        ),
      } as unknown as NfeCancelPipeline['transmitter'];
    }

    const pipeline = new MockableNfeCancelPipeline({
      pfxPathOrBase64: 'mock',
      password: 'mock',
    });

    const result = await pipeline.execute(
      {
        chNFe,
        identification,
        nProt: '135240000000001',
        xJust: 'Cancelamento de teste',
      },
      { tpAmb: Environment.Homolog },
    );

    expect(result.isRight()).toBe(true);
    expect(pipeline.signMock).toHaveBeenCalledWith(
      expect.objectContaining({
        infEvento: expect.objectContaining({
          CNPJ: identification,
        }),
      }),
      expect.anything(),
      expect.anything(),
    );
    expect(pipeline.certificates.getCertificateInfo).not.toHaveBeenCalled();
  });
});
