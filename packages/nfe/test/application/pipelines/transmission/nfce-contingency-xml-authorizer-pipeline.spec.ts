import type { NFCe } from '@nfets/nfe/infrastructure/dto/nfe/nfce';
import type { NfceRemoteClient } from '@nfets/nfe/domain/entities/transmission/nfce-remote-client';
import type { ReadCertificateRequest } from '@nfets/core/domain';
import type { RemoteTransmissionRepository } from '@nfets/core/domain';

import axios from 'axios';

import { right } from '@nfets/core/shared';
import { expectIsLeft, expectIsRight } from '@nfets/test/expects';
import { NfceRemoteTransmitter } from '@nfets/nfe/application/transmission/nfce-transmitter';
import { NfceContingencyXmlAuthorizerPipeline } from '@nfets/nfe/application/pipelines/transmission/nfce-contingency-xml-authorizer-pipeline';
import { NfceXmlBuilderPipeline } from '@nfets/nfe/application';
import { getCnpjCertificateReadRequest } from '@nfets/test/certificates';
import { ensurePlatform } from '@nfets/test/ensure-platform';
import { Environment, StateCodes } from '@nfets/core/domain';
import {
  Xml2JsToolkit,
  MemoryCacheAdapter,
  NativeCertificateRepository,
} from '@nfets/core';
import { TpEmis } from '@nfets/nfe/domain';

const toolkit = new Xml2JsToolkit();
const certificateRequest = getCnpjCertificateReadRequest();

const buildSignedNfceXml = async (): Promise<string> => {
  const xmlBuilderPipeline = new NfceXmlBuilderPipeline<NFCe>(
    certificateRequest,
  );
  const builder = xmlBuilderPipeline.build((builder) =>
    builder
      .infNFe({ versao: '4.00' })
      .ide({
        cUF: StateCodes.SP,
        cNF: '12345678',
        natOp: 'Venda',
        mod: '65',
        serie: '1',
        nNF: '1',
        dhEmi: '2024-01-01T10:00:00-03:00',
        tpNF: '1',
        idDest: '1',
        cMunFG: '3550308',
        tpImp: '4',
        tpEmis: TpEmis.Normal,
        cDV: '1',
        tpAmb: Environment.Homolog,
        finNFe: '1',
        indFinal: '1',
        indPres: '1',
        procEmi: '0',
        verProc: 'test',
      })
      .emit({
        CNPJ: '12345678000190',
        xNome: 'Teste',
        IE: '123456789012',
        CRT: '1',
        enderEmit: {
          xLgr: 'Rua Teste',
          nro: '123',
          xBairro: 'Centro',
          cMun: '3550308',
          xMun: 'Sao Paulo',
          UF: 'SP',
          CEP: '01000000',
          cPais: '1058',
          xPais: 'Brasil',
        },
      })
      .det(
        [
          {
            description: 'Product 1',
            code: '1',
            price: 1,
            quantity: 1,
            unit: 'UN',
            total: 1,
          },
        ],
        (ctx, item) =>
          ctx
            .prod({
              cProd: item.code,
              cEAN: 'SEM GTIN',
              xProd: item.description,
              NCM: '00000000',
              CFOP: '5102',
              uCom: item.unit,
              qCom: item.quantity,
              vUnCom: item.price,
              vProd: item.total,
              cEANTrib: 'SEM GTIN',
              uTrib: item.unit,
              qTrib: item.quantity,
              vUnTrib: item.price,
              indTot: '1',
            })
            .icms({
              ICMS00: {
                orig: '0',
                CST: '00',
                modBC: '0',
                vBC: '0',
                pICMS: '0',
                vICMS: '0',
              },
            }),
      )
      .transp({ modFrete: '9' })
      .pag({ detPag: [{ tPag: '01', vPag: '1' }] }),
  );

  const xmlOrLeft = await builder.assemble();
  expectIsRight(xmlOrLeft);
  return xmlOrLeft.value;
};

describe('nfce contingency xml authorizer pipeline (unit)', () => {
  if (process.env.CI && ensurePlatform('win32'))
    return it.skip("Skipping in CI due to Github actions hosted runners doesn't support the current user certificate store.", () =>
      void 0);

  let pipeline: NfceContingencyXmlAuthorizerPipeline;
  let sendSpy: jest.SpyInstance;
  let signNfeSpy: jest.SpyInstance;

  beforeAll(async () => {
    const certificates = new NativeCertificateRepository(
      axios.create(),
      new MemoryCacheAdapter(),
    );

    const certificate = await certificates.read(certificateRequest);
    certificates.read = jest.fn().mockResolvedValue(certificate);

    class MockableNfceContingencyXmlAuthorizerPipeline extends NfceContingencyXmlAuthorizerPipeline {
      protected override readonly soap: RemoteTransmissionRepository<NfceRemoteClient> =
        {
          setCertificate: jest.fn(),
          send: jest.fn().mockResolvedValue(
            right({
              retEnviNFe: {
                $: { versao: '4.00' },
                tpAmb: Environment.Homolog,
                cUF: StateCodes.SP,
                verAplic: '1.0',
                cStat: '104',
                xMotivo: 'Lote processado',
                dhRecbto: new Date().toISOString(),
                protNFe: {
                  $: { versao: '4.00' },
                  infProt: {
                    tpAmb: Environment.Homolog,
                    verAplic: '1.0',
                    chNFe: '123456789012345',
                    dhRecbto: new Date().toISOString(),
                    nProt: '123456789012345',
                    digVal: '123456789012345',
                    cStat: '100',
                    xMotivo: 'Autorizado o uso da NF-e',
                  },
                },
              },
            }),
          ),
        };

      protected override transmitter = new NfceRemoteTransmitter(
        this.soap,
        this.qrCode,
      );
      protected override readonly certificates = certificates;

      constructor(certificate: ReadCertificateRequest) {
        super(certificate);
        sendSpy = jest.spyOn(this.soap, 'send');
        signNfeSpy = jest.spyOn(this, 'signNfe' as never);
      }
    }

    pipeline = new MockableNfceContingencyXmlAuthorizerPipeline(
      certificateRequest,
    );
  });

  beforeEach(() => {
    sendSpy.mockClear();
    signNfeSpy.mockClear();
  });

  it('should not re-sign the stored contingency xml', async () => {
    const xml = await buildSignedNfceXml();

    const result = await pipeline.execute({ xml, idLote: '1' });

    expectIsRight(result);
    expect(signNfeSpy).not.toHaveBeenCalled();
  });

  it('should transmit through the entity serializer when digest is preserved', async () => {
    const xml = await buildSignedNfceXml();

    await pipeline.execute({ xml, idLote: '1' });

    expect(sendSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'nfeAutorizacaoLote',
        payload: expect.objectContaining({
          enviNFe: expect.objectContaining({
            NFe: expect.any(Array),
          }),
        }),
      }),
    );
    expect(sendSpy.mock.calls[0][0].xml).toBeUndefined();
  });

  it('should reject unsigned xml', async () => {
    const unsigned = await toolkit.build(
      {
        $: { xmlns: 'http://www.portalfiscal.inf.br/nfe' },
        infNFe: { $: { versao: '4.00' }, ide: { cUF: StateCodes.SP } },
      },
      { rootName: 'NFe' },
    );

    const result = await pipeline.execute({ xml: unsigned, idLote: '1' });

    expectIsLeft(result);
    expect(result.value.message).toBe('NFC-e XML must be signed');
    expect(sendSpy).not.toHaveBeenCalled();
  });

  it('should reject xml when round-trip digest does not match', async () => {
    const xml = (await buildSignedNfceXml()).replace(
      '<vNF>1.00</vNF>',
      '<vNF>9.00</vNF>',
    );

    const result = await pipeline.execute({ xml, idLote: '1' });

    expectIsLeft(result);
    expect(result.value.message).toBe('NFC-e XML signature digest mismatch');
    expect(sendSpy).not.toHaveBeenCalled();
  });
});
