import type { NFCe } from '@nfets/nfe/domain/entities/nfe/nfce';
import type { Signature } from '@nfets/core/domain/entities/signer/signature';
import type { SignedEntity } from '@nfets/core/domain/repositories/signer-repository';
import type { CertificateRepository } from '@nfets/core/domain';
import type { ReadCertificateResponse } from '@nfets/core/domain/entities/certificate/certificate';
import type { StateCode, XmlToolkit } from '@nfets/core/domain';

import path from 'node:path';
import axios from 'axios';
import crypto from 'node:crypto';

import { TpEmis } from '@nfets/nfe/domain/entities/constants/tp-emis';
import { XmlSigner } from '@nfets/core/application/signer/xml-signer';
import { NfceQrcode } from '@nfets/nfe/application/transmission/nfce-qrcode';
import { left, right } from '@nfets/core';
import { NfeXmlBuilder } from '@nfets/nfe/application/xml-builder/nfe-xml-builder';
import { SignatureAlgorithm } from '@nfets/core/domain/entities/signer/algo';
import { expectIsLeft, expectIsRight } from '@nfets/test/expects';
import Schemas, {
  schemas,
} from '@nfets/nfe/domain/entities/transmission/schemas';
import {
  Xml2JsToolkit,
  MemoryCacheAdapter,
  NativeCertificateRepository,
} from '@nfets/core/infrastructure';
import {
  getCnpjCertificate,
  getCertificatePassword,
} from '@nfets/test/certificates';
import { ensurePlatform } from '@nfets/test/ensure-platform';
import {
  createValidIde,
  createValidPag,
  createValidEmit,
  createValidItems,
  createValidTransp,
} from '../../fixtures/data';

const URL_SERVICE = 'https://hom.example.com/nfce/consulta';
const URL_CONSULT = 'https://hom.example.com/nfce/consulta-chave';

const CHAVE_EMISSAO = '52240646755763000143550990000080181785272515';
const CHAVE_CONTINGENCIA = '42260303916076000583650660000003699177489281';

const certStub = {} as ReadCertificateResponse;
const nfeV400XsdPath = path.resolve(schemas(), 'PL_010_V1.30', 'nfe_v4.00.xsd');

const escapeXmlText = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const insertInfNFeSupl = (
  xml: string,
  qrCode: string,
  urlChave: string,
): string => {
  const block = `  <infNFeSupl>
    <qrCode>${escapeXmlText(qrCode)}</qrCode>
    <urlChave>${escapeXmlText(urlChave)}</urlChave>
  </infNFeSupl>
`;
  return xml.replace(/<\/NFe>\s*$/, `${block}</NFe>`);
};

const digestToOfflineHex = (digestValue: string): string =>
  digestValue
    .split('')
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');

const minimalSignature = (digestValue: string): Signature => {
  return {
    SignedInfo: {
      Reference: {
        DigestValue: digestValue,
      },
    },
  } as Signature;
};

const createSignedNfce = (opts: {
  tpEmis: TpEmis;
  dhEmi: string;
  vNF: string;
  dest?: NFCe['infNFe']['dest'];
  digestValue?: string;
  /** Chave de 44 dígitos (sem prefixo NFe). Em offline use {@link CHAVE_CONTINGENCIA} para XSD. */
  chave?: string;
}): SignedEntity<NFCe> => {
  const {
    tpEmis,
    dhEmi,
    vNF,
    dest,
    digestValue = 'AB',
    chave = CHAVE_EMISSAO,
  } = opts;
  const cUF = chave.slice(0, 2);
  const cDV = chave.slice(-1);
  return {
    $: { xmlns: 'http://www.portalfiscal.inf.br/nfe' },
    infNFe: {
      $: { versao: '4.00', Id: `NFe${chave}` },
      ide: {
        cUF: cUF as StateCode,
        cNF: '12345678',
        natOp: 'Venda',
        mod: '65',
        serie: '1',
        nNF: '1',
        dhEmi,
        tpNF: '1',
        idDest: '1',
        cMunFG: '4205407',
        tpImp: '4',
        tpEmis,
        cDV,
        tpAmb: '2',
        finNFe: '1',
        indFinal: '1',
        indPres: '1',
        procEmi: '0',
        verProc: 'nfets-test',
      },
      emit: {
        CNPJ: '46755763000143',
        xNome: 'Emit',
        enderEmit: {
          xLgr: 'Rua',
          nro: '1',
          xBairro: 'Centro',
          cMun: '4205407',
          xMun: 'X',
          UF: 'SC',
          CEP: '88000000',
          cPais: '1058',
          xPais: 'Brasil',
        },
        IE: '123',
        CRT: '1',
      },
      det: [
        {
          $: { nItem: '1' },
          prod: {
            cProd: '1',
            cEAN: 'SEM GTIN',
            xProd: 'P',
            NCM: '00000000',
            CFOP: '5102',
            uCom: 'UN',
            qCom: '1',
            vUnCom: vNF,
            vProd: vNF,
            cEANTrib: 'SEM GTIN',
            uTrib: 'UN',
            qTrib: '1',
            vUnTrib: vNF,
            indTot: '1',
          },
          imposto: {
            ICMS: { ICMSSN102: { orig: '0', CSOSN: '102' } },
          },
        },
      ],
      total: {
        ICMSTot: {
          vBC: '0',
          vICMS: '0',
          vICMSDeson: '0',
          vFCP: '0',
          vBCST: '0',
          vST: '0',
          vFCPST: '0',
          vFCPSTRet: '0',
          vProd: vNF,
          vFrete: '0',
          vSeg: '0',
          vDesc: '0',
          vII: '0',
          vIPI: '0',
          vIPIDevol: '0',
          vPIS: '0',
          vCOFINS: '0',
          vOutro: '0',
          vNF,
          vTotTrib: '0',
        },
      },
      transp: { modFrete: '9' },
      pag: { detPag: [{ tPag: '01', vPag: vNF }] },
      ...(dest ? { dest } : {}),
    },
    Signature: minimalSignature(digestValue),
  };
};

describe('NfceQrcode', () => {
  const dhEmi = '2024-06-15T15:00:00-03:00';
  const dayOfMonth = String(new Date(dhEmi).getDate());
  const dayOfMonthPadded = dayOfMonth.padStart(2, '0');

  describe('QR Code versão 2.00 (200)', () => {
    it('emissão normal: monta p com chave, versão, ambiente, CSCId e hash SHA1(CSC)', async () => {
      const sign = jest.fn();
      const repository = { sign } as unknown as CertificateRepository;
      const qrcode = new NfceQrcode(repository);

      const entity = createSignedNfce({
        tpEmis: TpEmis.Normal,
        dhEmi,
        vNF: '100.00',
      });

      const sequence = `${CHAVE_EMISSAO}|2|2|1`;
      const expectedHash = crypto
        .createHash('sha1')
        .update(`${sequence}TOKEN_CSC`)
        .digest('hex')
        .toUpperCase();

      const result = await qrcode.execute(entity, {
        version: '200',
        urlService: URL_SERVICE,
        urlConsult: URL_CONSULT,
        CSC: 'TOKEN_CSC',
        CSCId: '000001',
      });

      expectIsRight(result);
      expect(result.value.urlChave).toBe(URL_CONSULT);
      expect(result.value.qrCode).toBe(
        `${URL_SERVICE}?p=${sequence}|${expectedHash}`,
      );
      expect(sign).not.toHaveBeenCalled();
    });

    it('contingência offline (tpEmis 9): inclui dia do mês, vNF, digest em hex e CSCId no texto antes do hash', async () => {
      const sign = jest.fn();
      const repository = { sign } as unknown as CertificateRepository;
      const qrcode = new NfceQrcode(repository);

      const digest = 'x9';
      const entity = createSignedNfce({
        tpEmis: TpEmis.OFFLINE,
        dhEmi,
        vNF: '10.50',
        digestValue: digest,
        chave: CHAVE_CONTINGENCIA,
      });

      const hex = digestToOfflineHex(digest);
      const sequence = `${CHAVE_CONTINGENCIA}|2|2|${dayOfMonth}|10.50|${hex}|1`;
      const expectedHash = crypto
        .createHash('sha1')
        .update(`${sequence}ABC123`)
        .digest('hex')
        .toUpperCase();

      const result = await qrcode.execute(entity, {
        version: '200',
        urlService: URL_SERVICE,
        urlConsult: URL_CONSULT,
        CSC: 'ABC123',
        CSCId: '000001',
      });

      expectIsRight(result);
      expect(result.value.qrCode).toBe(
        `${URL_SERVICE}?p=${sequence}|${expectedHash}`,
      );
      expect(sign).not.toHaveBeenCalled();
    });
  });

  describe('QR Code versão 3.00 (300)', () => {
    it('emissão normal: URL só com chave, versão 3 e ambiente (sem assinatura digital)', async () => {
      const sign = jest.fn();
      const repository = { sign } as unknown as CertificateRepository;
      const qrcode = new NfceQrcode(repository);

      const entity = createSignedNfce({
        tpEmis: TpEmis.Normal,
        dhEmi,
        vNF: '1.00',
      });

      const result = await qrcode.execute(entity, {
        version: '300',
        urlService: URL_SERVICE,
        urlConsult: URL_CONSULT,
        certificate: certStub,
      });

      expectIsRight(result);
      expect(result.value.qrCode).toBe(`${URL_SERVICE}?p=${CHAVE_EMISSAO}|3|2`);
      expect(sign).not.toHaveBeenCalled();
    });

    it('contingência offline sem destinatário: campos tipo e documento vazios; assina sequência com SHA1 RSA', async () => {
      const sign = jest.fn().mockResolvedValue(right('SIG_BASE64=='));
      const repository = { sign } as unknown as CertificateRepository;
      const qrcode = new NfceQrcode(repository);

      const entity = createSignedNfce({
        tpEmis: TpEmis.OFFLINE,
        dhEmi,
        vNF: '10.00',
        chave: CHAVE_CONTINGENCIA,
      });

      const expectedSequence = `${CHAVE_CONTINGENCIA}|3|2|${dayOfMonthPadded}|10.00||`;

      const result = await qrcode.execute(entity, {
        version: '300',
        urlService: URL_SERVICE,
        urlConsult: URL_CONSULT,
        certificate: certStub,
      });

      expectIsRight(result);
      expect(result.value.qrCode).toBe(
        `${URL_SERVICE}?p=${expectedSequence}|SIG_BASE64==`,
      );
      expect(sign).toHaveBeenCalledTimes(1);
      expect(sign).toHaveBeenCalledWith(
        expectedSequence,
        certStub,
        SignatureAlgorithm.SHA1,
      );
    });

    it('contingência offline com CPF válido: tipo 1 e 11 dígitos', async () => {
      const sign = jest.fn().mockResolvedValue(right('SIG'));
      const repository = { sign } as unknown as CertificateRepository;
      const qrcode = new NfceQrcode(repository);

      const entity = createSignedNfce({
        tpEmis: TpEmis.OFFLINE,
        dhEmi,
        vNF: '5.00',
        chave: CHAVE_CONTINGENCIA,
        dest: {
          CPF: '317.028.210-72',
          xNome: 'Cliente',
          indIEDest: '9',
        },
      });

      const expectedSequence = `${CHAVE_CONTINGENCIA}|3|2|${dayOfMonthPadded}|5.00|1|31702821072`;

      const result = await qrcode.execute(entity, {
        version: '300',
        urlService: URL_SERVICE,
        urlConsult: URL_CONSULT,
        certificate: certStub,
      });

      expectIsRight(result);
      expect(sign).toHaveBeenCalledWith(
        expectedSequence,
        certStub,
        SignatureAlgorithm.SHA1,
      );
    });

    it('contingência offline com CNPJ válido: tipo 2 e 14 dígitos', async () => {
      const sign = jest.fn().mockResolvedValue(right('SIG'));
      const repository = { sign } as unknown as CertificateRepository;
      const qrcode = new NfceQrcode(repository);

      const entity = createSignedNfce({
        tpEmis: TpEmis.OFFLINE,
        dhEmi,
        vNF: '99.99',
        chave: CHAVE_CONTINGENCIA,
        dest: {
          CNPJ: '46.755.763/0001-43',
          xNome: 'Empresa',
          indIEDest: '1',
        },
      });

      const expectedSequence = `${CHAVE_CONTINGENCIA}|3|2|${dayOfMonthPadded}|99.99|2|46755763000143`;

      const result = await qrcode.execute(entity, {
        version: '300',
        urlService: URL_SERVICE,
        urlConsult: URL_CONSULT,
        certificate: certStub,
      });

      expectIsRight(result);
      expect(sign).toHaveBeenCalledWith(
        expectedSequence,
        certStub,
        SignatureAlgorithm.SHA1,
      );
    });

    it('contingência offline com id estrangeiro (3–14 dígitos após sanitizar): tipo 3', async () => {
      const sign = jest.fn().mockResolvedValue(right('SIG'));
      const repository = { sign } as unknown as CertificateRepository;
      const qrcode = new NfceQrcode(repository);

      const entity = createSignedNfce({
        tpEmis: TpEmis.OFFLINE,
        dhEmi,
        vNF: '1.00',
        chave: CHAVE_CONTINGENCIA,
        dest: {
          idEstrangeiro: 'EX-123456789',
          xNome: 'Foreign',
          indIEDest: '9',
        },
      });

      const expectedSequence = `${CHAVE_CONTINGENCIA}|3|2|${dayOfMonthPadded}|1.00|3|123456789`;

      const result = await qrcode.execute(entity, {
        version: '300',
        urlService: URL_SERVICE,
        urlConsult: URL_CONSULT,
        certificate: certStub,
      });

      expectIsRight(result);
      expect(sign).toHaveBeenCalledWith(
        expectedSequence,
        certStub,
        SignatureAlgorithm.SHA1,
      );
    });

    it('CPF com quantidade de dígitos inválida: ignora e trata como sem identificação', async () => {
      const sign = jest.fn().mockResolvedValue(right('SIG'));
      const repository = { sign } as unknown as CertificateRepository;
      const qrcode = new NfceQrcode(repository);

      const entity = createSignedNfce({
        tpEmis: TpEmis.OFFLINE,
        dhEmi,
        vNF: '1.00',
        chave: CHAVE_CONTINGENCIA,
        dest: {
          CPF: '123',
          xNome: 'X',
          indIEDest: '9',
        },
      });

      const expectedSequence = `${CHAVE_CONTINGENCIA}|3|2|${dayOfMonthPadded}|1.00||`;

      await qrcode.execute(entity, {
        version: '300',
        urlService: URL_SERVICE,
        urlConsult: URL_CONSULT,
        certificate: certStub,
      });

      expect(sign).toHaveBeenCalledWith(
        expectedSequence,
        certStub,
        SignatureAlgorithm.SHA1,
      );
    });

    it('prioriza CPF quando CPF e CNPJ estão presentes no dest', async () => {
      const sign = jest.fn().mockResolvedValue(right('SIG'));
      const repository = { sign } as unknown as CertificateRepository;
      const qrcode = new NfceQrcode(repository);

      const entity = createSignedNfce({
        tpEmis: TpEmis.OFFLINE,
        dhEmi,
        vNF: '1.00',
        chave: CHAVE_CONTINGENCIA,
        dest: {
          CPF: '11144477735',
          CNPJ: '46755763000143',
          xNome: 'X',
          indIEDest: '9',
        },
      });

      const expectedSequence = `${CHAVE_CONTINGENCIA}|3|2|${dayOfMonthPadded}|1.00|1|11144477735`;

      await qrcode.execute(entity, {
        version: '300',
        urlService: URL_SERVICE,
        urlConsult: URL_CONSULT,
        certificate: certStub,
      });

      expect(sign).toHaveBeenCalledWith(
        expectedSequence,
        certStub,
        SignatureAlgorithm.SHA1,
      );
    });

    it('propaga falha quando a assinatura digital do QR Code offline falha', async () => {
      const err = new Error('sign failed');
      const sign = jest.fn().mockResolvedValue(left(err));
      const repository = { sign } as unknown as CertificateRepository;
      const qrcode = new NfceQrcode(repository);

      const entity = createSignedNfce({
        tpEmis: TpEmis.OFFLINE,
        dhEmi,
        vNF: '1.00',
        chave: CHAVE_CONTINGENCIA,
      });

      const result = await qrcode.execute(entity, {
        version: '300',
        urlService: URL_SERVICE,
        urlConsult: URL_CONSULT,
        certificate: certStub,
      });

      expectIsLeft(result);
      expect(result.value).toBe(err);
    });
  });

  /** Monta NFe com `NfeXmlBuilder` (PL_009_V4) e valida o XML assinado com `nfe_v4.00.xsd` do PL_010_V1.30 — inclusive os `xs:pattern` de `infNFeSupl/qrCode`. */
  describe('validação XSD (PL_010_V1.30 / nfe_v4.00.xsd)', () => {
    if (process.env.CI && ensurePlatform('win32'))
      return it.skip(
        "Skipping in CI due to Github actions hosted runners doesn't support the current user certificate store.",
      );

    let toolkit: XmlToolkit;
    let signer: XmlSigner;
    let certificate: ReadCertificateResponse;
    let certificateRepository: CertificateRepository;

    beforeAll(async () => {
      toolkit = new Xml2JsToolkit();
      certificateRepository = new NativeCertificateRepository(
        axios.create(),
        new MemoryCacheAdapter(),
      );
      signer = new XmlSigner(
        toolkit,
        certificateRepository,
        SignatureAlgorithm.SHA1,
      );
      const certificateOrError = await certificateRepository.read({
        pfxPathOrBase64: getCnpjCertificate(),
        password: getCertificatePassword(),
      });
      if (certificateOrError.isLeft()) return;
      certificate = certificateOrError.value;
    });

    async function assembleNfeComQr(
      chave44: string,
      qrCode: string,
      urlChave: string,
    ): Promise<string> {
      const cUF = chave44.slice(0, 2);
      const cDV = chave44.slice(-1);
      const builder = NfeXmlBuilder.create(
        toolkit,
        undefined,
        Schemas.PL_009_V4,
      )
        .infNFe({ versao: '4.00', Id: `NFe${chave44}` })
        .ide({
          ...createValidIde(),
          cUF: cUF as StateCode,
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
              ICMSSN102: {
                orig: '0',
                CSOSN: '102',
              },
            })
            .pis({
              PISNT: {
                CST: '08',
              },
            })
            .cofins({
              COFINSNT: {
                CST: '08',
              },
            }),
        )
        .transp(createValidTransp())
        .pag(createValidPag());

      const xml = await builder.assemble();
      expectIsRight(xml);
      const withSupl = insertInfNFeSupl(xml.value, qrCode, urlChave);
      const signed = await signer.sign(
        withSupl,
        { tag: 'infNFe', mark: 'Id' },
        certificate,
      );
      expectIsRight(signed);
      return signed.value;
    }

    it('QR v2 online (200): infNFeSupl atende ao schema', async () => {
      const sign = jest.fn();
      const repository = { sign } as unknown as CertificateRepository;
      const qrcode = new NfceQrcode(repository);

      const result = await qrcode.execute(
        createSignedNfce({
          tpEmis: TpEmis.Normal,
          dhEmi,
          vNF: '100.00',
        }),
        {
          version: '200',
          urlService: URL_SERVICE,
          urlConsult: URL_CONSULT,
          CSC: 'TOKEN_CSC',
          CSCId: '000001',
        },
      );
      expectIsRight(result);

      const xml = await assembleNfeComQr(
        CHAVE_EMISSAO,
        result.value.qrCode,
        result.value.urlChave,
      );
      expectIsRight(await toolkit.validate(xml, nfeV400XsdPath));
    });

    it('QR v2 offline (200) com digest de 28 caracteres (56 hex): infNFeSupl atende ao schema', async () => {
      const sign = jest.fn();
      const repository = { sign } as unknown as CertificateRepository;
      const qrcode = new NfceQrcode(repository);

      const digest28 = 'Z'.repeat(28);
      const result = await qrcode.execute(
        createSignedNfce({
          tpEmis: TpEmis.OFFLINE,
          dhEmi,
          vNF: '10.50',
          digestValue: digest28,
          chave: CHAVE_CONTINGENCIA,
        }),
        {
          version: '200',
          urlService: URL_SERVICE,
          urlConsult: URL_CONSULT,
          CSC: 'ABC123',
          CSCId: '000001',
        },
      );
      expectIsRight(result);

      const xml = await assembleNfeComQr(
        CHAVE_CONTINGENCIA,
        result.value.qrCode,
        result.value.urlChave,
      );
      expectIsRight(await toolkit.validate(xml, nfeV400XsdPath));
    });

    it('QR v3 online (300): infNFeSupl atende ao schema', async () => {
      const sign = jest.fn();
      const repository = { sign } as unknown as CertificateRepository;
      const qrcode = new NfceQrcode(repository);

      const result = await qrcode.execute(
        createSignedNfce({
          tpEmis: TpEmis.Normal,
          dhEmi,
          vNF: '1.00',
        }),
        {
          version: '300',
          urlService: URL_SERVICE,
          urlConsult: URL_CONSULT,
          certificate: certStub,
        },
      );
      expectIsRight(result);

      const xml = await assembleNfeComQr(
        CHAVE_EMISSAO,
        result.value.qrCode,
        result.value.urlChave,
      );
      expectIsRight(await toolkit.validate(xml, nfeV400XsdPath));
    });

    it('QR v3 offline (300): infNFeSupl atende ao schema', async () => {
      const sign = jest.fn().mockResolvedValue(right('dGVzdA=='));
      const repository = { sign } as unknown as CertificateRepository;
      const qrcode = new NfceQrcode(repository);

      const result = await qrcode.execute(
        createSignedNfce({
          tpEmis: TpEmis.OFFLINE,
          dhEmi,
          vNF: '10.00',
          chave: CHAVE_CONTINGENCIA,
        }),
        {
          version: '300',
          urlService: URL_SERVICE,
          urlConsult: URL_CONSULT,
          certificate: certStub,
        },
      );

      expectIsRight(result);

      const xml = await assembleNfeComQr(
        CHAVE_CONTINGENCIA,
        result.value.qrCode,
        result.value.urlChave,
      );
      expectIsRight(await toolkit.validate(xml, nfeV400XsdPath));
    });
  });
});
