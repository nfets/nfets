import { gzipSync } from 'node:zlib';
import { NfeDistribuicaoDFePipeline } from '@nfets/nfe/application/pipelines/transmission/nfe-distribuicao-dfe-pipeline';
import { NfeRemoteTransmitter } from '@nfets/nfe/application/transmission/nfe-transmitter';
import { Environment, StateCodes } from '@nfets/core/domain';
import { left, right } from '@nfets/core/shared';
import { NFeTsError } from '@nfets/core';

const chNFe = '35240100000000000000550010000000011000000010';
const identification = '03916076000583';

const resNFe = `<resNFe versao="1.01" xmlns="http://www.portalfiscal.inf.br/nfe"><chNFe>${chNFe}</chNFe></resNFe>`;

const docZip = (NSU: string, schema: string, xml: string) => ({
  $: { NSU, schema },
  $value: gzipSync(Buffer.from(xml, 'utf8')).toString('base64'),
});

const retDistDFeInt = (loteDistDFeInt?: unknown) => ({
  $: { versao: '1.01' },
  tpAmb: '2',
  verAplic: '1.7.6',
  cStat: loteDistDFeInt ? '138' : '640',
  xMotivo: loteDistDFeInt
    ? 'Documento localizado'
    : 'Rejeicao: CNPJ/CPF do interessado nao possui permissao para consultar esta NF-e',
  dhResp: '2025-12-22T18:40:33-03:00',
  ultNSU: '000000000000000',
  maxNSU: '000000000000000',
  ...(loteDistDFeInt ? { loteDistDFeInt } : {}),
});

const certificate = { pfxPathOrBase64: 'mock', password: 'mock' };

const mockablePipeline = (response: unknown) => {
  class MockableNfeDistribuicaoDFePipeline extends NfeDistribuicaoDFePipeline {
    public readonly configureMock = jest.fn();
    public readonly distribuicaoDFeMock = jest.fn().mockResolvedValue(response);

    protected override readonly certificates = {
      read: jest.fn().mockResolvedValue(right({ certificate: 'mock' })),
    } as unknown as NfeDistribuicaoDFePipeline['certificates'];

    protected override readonly transmitter = {
      configure: this.configureMock,
      distribuicaoDFe: this.distribuicaoDFeMock,
    } as unknown as NfeDistribuicaoDFePipeline['transmitter'];
  }

  return new MockableNfeDistribuicaoDFePipeline(certificate);
};

describe('nfe distribuicao dfe pipeline (unit)', () => {
  it('should use nfe remote transmitter', () => {
    class NfeDistribuicaoDFePipelineExposed extends NfeDistribuicaoDFePipeline {
      public get transmitterRef() {
        return this.transmitter;
      }
    }

    const pipeline = new NfeDistribuicaoDFePipelineExposed(certificate);

    expect(pipeline.transmitterRef).toBeInstanceOf(NfeRemoteTransmitter);
  });

  it('should consult by access key and return the unzipped document', async () => {
    const pipeline = mockablePipeline(
      right({
        nfeDistDFeInteresseResult: {
          retDistDFeInt: retDistDFeInt({
            docZip: docZip('000000000000001', 'resNFe_v1.01.xsd', resNFe),
          }),
        },
      }),
    );

    const result = await pipeline.execute(
      { chNFe, identification, cUFAutor: StateCodes.SC },
      { tpAmb: Environment.Homolog },
    );

    expect(result.isRight()).toBe(true);
    expect(pipeline.configureMock).toHaveBeenCalledWith({
      cUF: '91',
      tpAmb: Environment.Homolog,
      certificate: { certificate: 'mock' },
    });
    expect(pipeline.distribuicaoDFeMock).toHaveBeenCalledWith({
      tpAmb: Environment.Homolog,
      cUFAutor: StateCodes.SC,
      CNPJ: identification,
      CPF: undefined,
      consChNFe: { chNFe },
    });

    const { response, xml } = result.value as {
      response: { cStat: string };
      xml?: string;
    };
    expect(response.cStat).toBe('138');
    expect(xml).toBe(resNFe);
  });

  it('should return no xml when sefaz rejects the consult', async () => {
    const pipeline = mockablePipeline(
      right({ nfeDistDFeInteresseResult: { retDistDFeInt: retDistDFeInt() } }),
    );

    const result = await pipeline.execute(
      { chNFe, identification, cUFAutor: StateCodes.SC },
      { tpAmb: Environment.Homolog },
    );

    expect(result.isRight()).toBe(true);
    const { response, xml } = result.value as {
      response: { cStat: string };
      xml?: string;
    };
    expect(response.cStat).toBe('640');
    expect(xml).toBeUndefined();
  });

  it('should return left when certificate read fails', async () => {
    class ReadFailPipeline extends NfeDistribuicaoDFePipeline {
      public readonly distribuicaoDFeMock = jest.fn();

      protected override readonly certificates = {
        read: jest
          .fn()
          .mockResolvedValue(left(new NFeTsError('certificate error'))),
      } as unknown as NfeDistribuicaoDFePipeline['certificates'];

      protected override readonly transmitter = {
        configure: jest.fn(),
        distribuicaoDFe: this.distribuicaoDFeMock,
      } as unknown as NfeDistribuicaoDFePipeline['transmitter'];
    }

    const pipeline = new ReadFailPipeline(certificate);

    const result = await pipeline.execute(
      { chNFe, identification, cUFAutor: StateCodes.SC },
      { tpAmb: Environment.Homolog },
    );

    expect(result.isLeft()).toBe(true);
    expect(pipeline.distribuicaoDFeMock).not.toHaveBeenCalled();
  });
});
