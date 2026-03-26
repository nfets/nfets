import { Environment } from '@nfets/core/domain';
import { right } from '@nfets/core/shared';
import { NfceVoidRangePipeline } from '@nfets/nfe/application/pipelines/transmission/nfce-void-range-pipeline';
import { NfeVoidRangePipeline } from '@nfets/nfe/application/pipelines/transmission/nfe-void-range-pipeline';
import { NfceRemoteTransmitter } from '@nfets/nfe/application/transmission/nfce-transmitter';

describe('nfce void range pipeline (unit)', () => {
  it('should use nfce remote transmitter', () => {
    class NfceVoidRangePipelineExposed extends NfceVoidRangePipeline {
      public get transmitterRef() {
        return this.transmitter;
      }
    }

    const pipeline = new NfceVoidRangePipelineExposed({
      pfxPathOrBase64: 'mock',
      password: 'mock',
    });

    expect(pipeline.transmitterRef).toBeInstanceOf(NfceRemoteTransmitter);
  });

  it('should delegate execute to super implementation', async () => {
    const superExecuteSpy = jest
      .spyOn(NfeVoidRangePipeline.prototype, 'execute')
      .mockResolvedValue(
        right({
          retInutNFe: { infInut: { cStat: '102', xMotivo: 'Inutilizacao homologada' } },
        }) as never,
      );

    const pipeline = new NfceVoidRangePipeline({
      pfxPathOrBase64: 'mock',
      password: 'mock',
    });

    const payload = {
      mod: '65',
      serie: '1',
      nNFIni: '1',
      nNFFin: '9',
      xJust: 'Teste de inutilizacao NFC-e',
    };
    const options = { tpAmb: Environment.Homolog, cUF: '35' } as const;

    const result = await pipeline.execute(payload, options);

    expect(result.isRight()).toBe(true);
    expect(superExecuteSpy).toHaveBeenCalledTimes(1);
    expect(superExecuteSpy).toHaveBeenCalledWith(payload, options);

    superExecuteSpy.mockRestore();
  });
});
