import { NfeCancelPipeline } from '@nfets/nfe/application/pipelines/transmission/nfe-cancel-pipeline';
import { NfeRemoteTransmitter } from '@nfets/nfe/application/transmission/nfe-transmitter';

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
});
