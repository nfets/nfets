import { getCnpjCertificateReadRequest } from '@nfets/test/certificates';
import {
  expectInOrder,
  expectIsLeft,
  expectIsRight,
} from '@nfets/test/expects';
import { NfceXmlBuilderPipeline } from '@nfets/nfe/application/pipelines/xml/nfce-xml-builder-pipeline';
import Schemas from '@nfets/nfe/domain/entities/transmission/schemas';
import {
  createValidEmit,
  createValidIde,
  createValidItems,
  createValidPag,
  createValidTransp,
} from '../../../fixtures/data';
import type { StateCode } from '@nfets/core/domain';
import type { NFe, NfceTransmitterOptions } from '@nfets/nfe/domain';

describe('NfceXmlBuilderPipeline', () => {
  const CHAVE = '52240646755763000143550990000080181785272515';

  const certificate = getCnpjCertificateReadRequest();

  const buildNfceMod65Sample = (
    pipeline: NfceXmlBuilderPipeline<NFe>,
    chave: string,
  ) => {
    const cUF = chave.slice(0, 2) as StateCode;
    const cDV = chave.slice(-1);

    pipeline.build((builder) =>
      builder
        .infNFe({ versao: '4.00', Id: `NFe${chave}` })
        .ide({
          ...createValidIde(),
          cUF,
          mod: '65',
          tpImp: '4',
          cDV,
        })
        .emit(createValidEmit())
        .det(createValidItems(), (ctx, item) =>
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
              ICMSSN102: { orig: '0', CSOSN: '102' },
            })
            .pis({ PISNT: { CST: '08' } })
            .cofins({ COFINSNT: { CST: '08' } }),
        )
        .transp(createValidTransp())
        .pag(createValidPag()),
    );
  };

  describe('sem QR na pipeline (delega ao NfeXmlBuilderPipeline)', () => {
    it('sem terceiro argumento: XML assinado e sem infNFeSupl', async () => {
      const pipeline = new NfceXmlBuilderPipeline<NFe>(
        certificate,
        Schemas.PL_009_V4,
      );
      buildNfceMod65Sample(pipeline, CHAVE);

      const xmlOrLeft = await pipeline.assemble();
      expectIsRight(xmlOrLeft);
      expect(xmlOrLeft.value).toContain('</Signature>');
      expect(xmlOrLeft.value).not.toContain('<infNFeSupl>');
    });

    it('options vazio {}: idem (runtime sem qrCode)', async () => {
      const pipeline = new NfceXmlBuilderPipeline<NFe>(
        certificate,
        Schemas.PL_009_V4,
        {} as Pick<NfceTransmitterOptions, 'qrCode'>,
      );
      buildNfceMod65Sample(pipeline, CHAVE);

      const xmlOrLeft = await pipeline.assemble();
      expectIsRight(xmlOrLeft);
      expect(xmlOrLeft.value).not.toContain('<infNFeSupl>');
    });

    it('options com qrCode undefined: idem', async () => {
      const pipeline = new NfceXmlBuilderPipeline<NFe>(
        certificate,
        Schemas.PL_009_V4,
        { qrCode: undefined } as unknown as Pick<
          NfceTransmitterOptions,
          'qrCode'
        >,
      );
      buildNfceMod65Sample(pipeline, CHAVE);

      const xmlOrLeft = await pipeline.assemble();
      expectIsRight(xmlOrLeft);
      expect(xmlOrLeft.value).not.toContain('<infNFeSupl>');
    });
  });

  describe('assemble com QR Code', () => {
    it('sem certificado retorna Left explicando a exigência', async () => {
      const pipeline = new NfceXmlBuilderPipeline<NFe>(
        undefined,
        Schemas.PL_009_V4,
        { qrCode: { version: '300' } },
      );
      buildNfceMod65Sample(pipeline, CHAVE);

      const xmlOrLeft = await pipeline.assemble();
      expectIsLeft(xmlOrLeft);
      expect(xmlOrLeft.value).toMatchObject({
        message: 'Certificate is required to assemble NFCe XML with QR Code',
      });
    });

    it('com certificado e QR v300: infNFeSupl, qrCode, urlChave e assinatura', async () => {
      const pipeline = new NfceXmlBuilderPipeline<NFe>(
        certificate,
        Schemas.PL_009_V4,
        { qrCode: { version: '300' } },
      );
      buildNfceMod65Sample(pipeline, CHAVE);

      const xmlOrLeft = await pipeline.assemble();
      expectIsRight(xmlOrLeft);
      expect(xmlOrLeft.value).toContain('<infNFeSupl>');
      expect(xmlOrLeft.value).toContain('<qrCode>');
      expect(xmlOrLeft.value).toContain('<urlChave>');
      expect(xmlOrLeft.value).toContain('</Signature>');
    });

    it('com certificado e QR v200 (CSC): inclui infNFeSupl', async () => {
      const pipeline = new NfceXmlBuilderPipeline<NFe>(
        certificate,
        Schemas.PL_009_V4,
        {
          qrCode: {
            version: '200',
            CSC: 'TOKEN_CSC',
            CSCId: '000001',
          },
        },
      );
      buildNfceMod65Sample(pipeline, CHAVE);

      const xmlOrLeft = await pipeline.assemble();
      expectIsRight(xmlOrLeft);
      expect(xmlOrLeft.value).toContain('<infNFeSupl>');
      expect(xmlOrLeft.value).toContain('<qrCode>');
      expect(xmlOrLeft.value).toContain('<urlChave>');
    });

    it('coloca infNFeSupl após </infNFe> e antes de <Signature>', async () => {
      const pipeline = new NfceXmlBuilderPipeline<NFe>(
        certificate,
        Schemas.PL_009_V4,
        { qrCode: { version: '300' } },
      );
      buildNfceMod65Sample(pipeline, CHAVE);

      const xmlOrLeft = await pipeline.assemble();
      expectIsRight(xmlOrLeft);

      expectInOrder(xmlOrLeft.value)
        .toContain('</infNFe>')
        .toContain('<infNFeSupl>')
        .toContain('<Signature');
    });
  });
});
