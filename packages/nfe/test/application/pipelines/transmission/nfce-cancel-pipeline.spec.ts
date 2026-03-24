import { NfceCancelPipeline } from '@nfets/nfe/application/pipelines/transmission/nfce-cancel-pipeline';
import { NfceRemoteTransmitter } from '@nfets/nfe/application/transmission/nfce-transmitter';

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
});
