import { NfceCancelPipeline } from '@nfets/nfe/application/pipelines/transmission/nfce-cancel-pipeline';
import { NfceRemoteTransmitter } from '@nfets/nfe/application/transmission/nfce-transmitter';
import { Environment } from '@nfets/core/domain';
import { right } from '@nfets/core/shared';
import { NfeCancelPipeline } from '@nfets/nfe/application/pipelines/transmission/nfe-cancel-pipeline';

describe('nfce cancel pipeline (unit)', () => {
  it('should use nfce remote transmitter', () => {
    class NfceCancelPipelineExposed extends NfceCancelPipeline {
      public get transmitterRef() {
        return this.transmitter;
      }
    }

    const pipeline = new NfceCancelPipelineExposed({
      pfxPathOrBase64: 'mock',
      password: 'mock',
    });

    expect(pipeline.transmitterRef).toBeInstanceOf(NfceRemoteTransmitter);
  });

  it('should delegate execute to super implementation', async () => {
    const superExecuteSpy = jest
      .spyOn(NfeCancelPipeline.prototype, 'execute')
      .mockResolvedValue(
        right({
          xml: '<procEventoNFe versao="1.00"></procEventoNFe>',
          response: {
            retEnvEvento: {
              cStat: '128',
              xMotivo: 'Lote de Evento Processado',
            },
          },
        }) as never,
      );

    const pipeline = new NfceCancelPipeline({
      pfxPathOrBase64: 'mock',
      password: 'mock',
    });

    const payload = {
      identification: '03916076000664',
      chNFe: '35240100000000000000650010000000011000000010',
      nProt: '135240000000001',
      xJust: 'Cancelamento NFC-e de teste',
    };
    const options = { tpAmb: Environment.Homolog } as const;

    const result = await pipeline.execute(payload, options);

    expect(result.isRight()).toBe(true);
    expect(superExecuteSpy).toHaveBeenCalledTimes(1);
    expect(superExecuteSpy).toHaveBeenCalledWith(payload, options);

    superExecuteSpy.mockRestore();
  });
});
