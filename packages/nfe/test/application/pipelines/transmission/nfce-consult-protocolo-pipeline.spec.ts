import { Environment } from '@nfets/core/domain';
import { right } from '@nfets/core/shared';
import { NfceRemoteTransmitter } from '@nfets/nfe/application/transmission/nfce-transmitter';
import { NfeConsultProtocoloPipeline } from '@nfets/nfe/application/pipelines/transmission/nfe-consult-protocolo-pipeline';
import { NfceConsultProtocoloPipeline } from '@nfets/nfe/application/pipelines/transmission/nfce-consult-protocolo-pipeline';

describe('nfce consult protocolo pipeline (unit)', () => {
  it('should use nfce remote transmitter', () => {
    class NfceConsultProtocoloPipelineExposed extends NfceConsultProtocoloPipeline {
      public get transmitterRef() {
        return this.transmitter;
      }
    }

    const pipeline = new NfceConsultProtocoloPipelineExposed({
      pfxPathOrBase64: 'mock',
      password: 'mock',
    });

    expect(pipeline.transmitterRef).toBeInstanceOf(NfceRemoteTransmitter);
  });

  it('should delegate execute to super implementation', async () => {
    const superExecuteSpy = jest
      .spyOn(NfeConsultProtocoloPipeline.prototype, 'execute')
      .mockResolvedValue(
        right({
          retConsSitNFe: {
            cStat: '100',
            xMotivo: 'Autorizado o uso da NF-e',
            chNFe: '35240100000000000000650010000000011000000010',
          },
        }) as never,
      );

    const pipeline = new NfceConsultProtocoloPipeline({
      pfxPathOrBase64: 'mock',
      password: 'mock',
    });

    const payload = {
      tpAmb: Environment.Homolog,
      chNFe: '35240100000000000000650010000000011000000010',
    };

    const result = await pipeline.execute(payload);

    expect(result.isRight()).toBe(true);
    expect(superExecuteSpy).toHaveBeenCalledTimes(1);
    expect(superExecuteSpy).toHaveBeenCalledWith(payload);

    superExecuteSpy.mockRestore();
  });
});
