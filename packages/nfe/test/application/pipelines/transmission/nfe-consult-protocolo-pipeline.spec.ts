import { Environment } from '@nfets/core/domain';
import { NFeTsError } from '@nfets/core';
import { left, right } from '@nfets/core/shared';
import { NfeConsultProtocoloPipeline } from '@nfets/nfe/application/pipelines/transmission/nfe-consult-protocolo-pipeline';

describe('nfe consult protocolo pipeline (unit)', () => {
  class MockableNfeConsultProtocoloPipeline extends NfeConsultProtocoloPipeline {
    public readonly readMock = jest.fn().mockResolvedValue(
      right({
        certificate: 'mock-certificate',
      }),
    );

    public readonly configureMock = jest.fn();
    public readonly consultaProtocoloMock = jest.fn().mockResolvedValue(
      right({
        retConsSitNFe: {
          cStat: '100',
          xMotivo: 'Autorizado o uso da NF-e',
          chNFe: '35240100000000000000550010000000011000000010',
        },
      }),
    );

    protected override readonly certificates = {
      read: this.readMock,
    } as unknown as NfeConsultProtocoloPipeline['certificates'];

    protected override readonly transmitter = {
      configure: this.configureMock,
      consultaProtocolo: this.consultaProtocoloMock,
    } as unknown as NfeConsultProtocoloPipeline['transmitter'];
  }

  it('should execute consulta protocolo flow successfully', async () => {
    const pipeline = new MockableNfeConsultProtocoloPipeline({
      pfxPathOrBase64: 'mock',
      password: 'mock',
    });

    const payload = {
      tpAmb: Environment.Homolog,
      chNFe: '35240100000000000000550010000000011000000010',
    };

    const result = await pipeline.execute(payload);

    expect(result.isRight()).toBe(true);
    expect(pipeline.configureMock).toHaveBeenCalledWith({
      tpAmb: Environment.Homolog,
      cUF: '35',
      certificate: { certificate: 'mock-certificate' },
    });
    expect(pipeline.consultaProtocoloMock).toHaveBeenCalledTimes(1);
    expect(pipeline.consultaProtocoloMock).toHaveBeenCalledWith(payload);
  });

  it('should return left when certificate read fails', async () => {
    class ReadFailNfeConsultProtocoloPipeline extends MockableNfeConsultProtocoloPipeline {
      protected override readonly certificates = {
        read: jest
          .fn()
          .mockResolvedValue(left(new NFeTsError('certificate error'))),
      } as unknown as NfeConsultProtocoloPipeline['certificates'];
    }

    const pipeline = new ReadFailNfeConsultProtocoloPipeline({
      pfxPathOrBase64: 'mock',
      password: 'mock',
    });

    const result = await pipeline.execute({
      tpAmb: Environment.Homolog,
      chNFe: '35240100000000000000550010000000011000000010',
    });

    expect(result.isLeft()).toBe(true);
    expect(pipeline.configureMock).not.toHaveBeenCalled();
    expect(pipeline.consultaProtocoloMock).not.toHaveBeenCalled();
  });
});
