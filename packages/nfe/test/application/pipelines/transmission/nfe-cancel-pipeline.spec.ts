import { NfeCancelPipeline } from '@nfets/nfe/application/pipelines/transmission/nfe-cancel-pipeline';
import { NfeRemoteTransmitter } from '@nfets/nfe/application/transmission/nfe-transmitter';
import { Environment } from '@nfets/core/domain';
import { left, right } from '@nfets/core/shared';
import { NFeTsError } from '@nfets/core';
import { TpEvent } from '@nfets/nfe/domain/entities/constants/tp-event';

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

  it('should execute cancellation and send event batch', async () => {
    class MockableNfeCancelPipeline extends NfeCancelPipeline {
      public readonly eventMock = jest.fn().mockResolvedValue(
        right({
          infEvento: { tpEvento: TpEvent.Cancelamento },
        }),
      );

      protected override readonly transmitter = {
        recepcaoEvento: jest.fn().mockResolvedValue(
          right({
            retEnvEvento: { cStat: '128', xMotivo: 'Lote de Evento Processado' },
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
        chNFe: '35240100000000000000550010000000011000000010',
        nProt: '135240000000001',
        xJust: 'Cancelamento de teste',
      },
      { tpAmb: Environment.Homolog },
    );

    expect(result.isRight()).toBe(true);
    expect(pipeline.eventMock).toHaveBeenCalledWith(
      TpEvent.Cancelamento,
      expect.objectContaining({
        chNFe: '35240100000000000000550010000000011000000010',
        nSeqEvento: 1,
      }),
      { tpAmb: Environment.Homolog },
    );
    expect(pipeline.transmitter.recepcaoEvento).toHaveBeenCalledWith(
      expect.objectContaining({
        idLote: expect.any(String),
      }),
    );
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
        chNFe: '35240100000000000000550010000000011000000010',
        nProt: '135240000000001',
        xJust: 'Cancelamento de teste',
      },
      { tpAmb: Environment.Homolog },
    );

    expect(result.isLeft()).toBe(true);
    expect(pipeline.transmitter.recepcaoEvento).not.toHaveBeenCalled();
  });
});
