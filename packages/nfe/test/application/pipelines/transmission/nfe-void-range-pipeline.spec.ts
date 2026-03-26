import { Environment } from '@nfets/core/domain';
import { left, right } from '@nfets/core/shared';
import { NFeTsError } from '@nfets/core';
import { NfeVoidRangePipeline } from '@nfets/nfe/application/pipelines/transmission/nfe-void-range-pipeline';

describe('nfe void range pipeline (unit)', () => {
  class MockableNfeVoidRangePipeline extends NfeVoidRangePipeline {
    public readonly readMock = jest.fn().mockResolvedValue(
      right({
        certificate: 'mock-certificate',
      }),
    );

    public readonly configureMock = jest.fn();
    public readonly inutilizacaoMock = jest.fn().mockResolvedValue(
      right({
        retInutNFe: { infInut: { cStat: '102', xMotivo: 'Inutilizacao homologada' } },
      }),
    );
    public readonly signMock = jest.fn().mockImplementation((payload) =>
      Promise.resolve(right(payload)),
    );

    protected override readonly certificates = {
      read: this.readMock,
      getCertificateInfo: jest.fn().mockReturnValue({
        CNPJ: '12345678000190',
        CPF: undefined,
      }),
    } as unknown as NfeVoidRangePipeline['certificates'];

    protected override readonly signer = {
      sign: this.signMock,
    } as unknown as NfeVoidRangePipeline['signer'];

    protected override readonly transmitter = {
      configure: this.configureMock,
      inutilizacao: this.inutilizacaoMock,
    } as unknown as NfeVoidRangePipeline['transmitter'];
  }

  it('should execute inutilizacao flow successfully', async () => {
    const pipeline = new MockableNfeVoidRangePipeline({
      pfxPathOrBase64: 'mock',
      password: 'mock',
    });

    const currentYear = new Date().getFullYear().toString().slice(2);

    const result = await pipeline.execute(
      {
        mod: '55',
        serie: '1',
        nNFIni: '1',
        nNFFin: '9',
        xJust: 'Teste de inutilizacao',
      },
      { tpAmb: Environment.Homolog, cUF: '35' },
    );

    expect(result.isRight()).toBe(true);
    expect(pipeline.configureMock).toHaveBeenCalledWith(
      expect.objectContaining({
        tpAmb: Environment.Homolog,
        cUF: '35',
      }),
    );

    expect(pipeline.signMock).toHaveBeenCalledTimes(1);
    expect(pipeline.inutilizacaoMock).toHaveBeenCalledTimes(1);
    expect(pipeline.inutilizacaoMock).toHaveBeenCalledWith(
      expect.objectContaining({
        infInut: expect.objectContaining({
          tpAmb: Environment.Homolog,
          cUF: '35',
          ano: currentYear,
          mod: '55',
          serie: '1',
          nNFIni: '1',
          nNFFin: '9',
          xJust: 'Teste de inutilizacao',
          $: expect.objectContaining({
            Id: `ID35${currentYear}1234567800019055001000000001000000009`,
          }),
        }),
      }),
    );
  });

  it('should return left when certificate read fails', async () => {
    class ReadFailNfeVoidRangePipeline extends MockableNfeVoidRangePipeline {
      protected override readonly certificates = {
        ...this.certificates,
        read: jest.fn().mockResolvedValue(left(new NFeTsError('certificate error'))),
      } as unknown as NfeVoidRangePipeline['certificates'];
    }

    const pipeline = new ReadFailNfeVoidRangePipeline({
      pfxPathOrBase64: 'mock',
      password: 'mock',
    });

    const result = await pipeline.execute(
      {
        mod: '55',
        serie: '1',
        nNFIni: '1',
        nNFFin: '9',
        xJust: 'Teste de inutilizacao',
      },
      { tpAmb: Environment.Homolog, cUF: '35' },
    );

    expect(result.isLeft()).toBe(true);
    expect(pipeline.configureMock).not.toHaveBeenCalled();
    expect(pipeline.signMock).not.toHaveBeenCalled();
    expect(pipeline.inutilizacaoMock).not.toHaveBeenCalled();
  });

  it('should return left when signing fails', async () => {
    class SignFailNfeVoidRangePipeline extends MockableNfeVoidRangePipeline {
      protected override readonly signer = {
        sign: jest.fn().mockResolvedValue(left(new NFeTsError('sign error'))),
      } as unknown as NfeVoidRangePipeline['signer'];
    }

    const pipeline = new SignFailNfeVoidRangePipeline({
      pfxPathOrBase64: 'mock',
      password: 'mock',
    });

    const result = await pipeline.execute(
      {
        mod: '55',
        serie: '1',
        nNFIni: '1',
        nNFFin: '9',
        xJust: 'Teste de inutilizacao',
      },
      { tpAmb: Environment.Homolog, cUF: '35' },
    );

    expect(result.isLeft()).toBe(true);
    expect(pipeline.inutilizacaoMock).not.toHaveBeenCalled();
  });
});
