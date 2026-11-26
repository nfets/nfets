import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { MenuFiscalStreamXmlSigner } from '../../../src/application/signer/menu-fiscal-stream-xml-signer';
import {
  CanonicalizationMethod,
  DigestAlgorithm,
  SignatureAlgorithm,
  SignatureMethod,
  SignatureNamespace,
} from '../../../src/domain/entities/signer/algo';
import type { ReadCertificateResponse } from '../../../src/domain/entities/certificate/certificate';
import type { CertificateRepository } from '../../../src/domain/repositories/certificate-repository';
import type { XmlToolkit } from '../../../src/domain/entities/xml/xml-toolkit';
import type { Signature } from '../../../src/domain/entities/signer/signature';
import { right } from '../../../src/shared/either';
import {
  MENU_FISCAL_CANONICAL_CLOSE,
  MENU_FISCAL_CANONICAL_ROOT_OPEN,
  MENU_FISCAL_REFERENCE_URI,
  menuFiscalCanonicalArquivoOpen,
} from '../../../src/infrastructure/xml/menu-fiscal-xml';
import { expectIsRight } from '@nfets/test/expects';

describe('MenuFiscalStreamXmlSigner (unit)', () => {
  let directory: string;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'nfets-menu-fiscal-signer-'));
  });

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  it('should sign menuFiscal xml into destination file', async () => {
    const nroArquivo = '1';
    const data = '2026-11-26';
    const hora = '11:00:00';
    const cdata = 'YWJjZA==';
    const sourcePath = join(directory, 'menu-fiscal.xml');
    const destinationPath = join(directory, 'menu-fiscal-signed.xml');
    let capturedSignature: Signature | undefined;

    await writeFile(
      sourcePath,
      [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<menuFiscal xmlns="http://www.sef.sc.gov.br/nfce">',
        `<arquivo nroArquivo="${nroArquivo}" data="${data}" hora="${hora}" arqBD="x" arqSist="y"><![CDATA[${cdata}]]></arquivo>`,
        '</menuFiscal>',
      ].join(''),
      'utf8',
    );

    const toolkit = {
      build: (object: object, options?: { rootName?: string }) => {
        if (options?.rootName !== 'Signature') {
          return Promise.resolve('<SignedInfo/>');
        }

        const signature = object as Signature;
        capturedSignature = signature;

        return Promise.resolve(
          [
            `<Signature xmlns="${signature.$.xmlns}">`,
            '<SignedInfo>',
            `<CanonicalizationMethod Algorithm="${signature.SignedInfo.CanonicalizationMethod.$.Algorithm}"/>`,
            `<SignatureMethod Algorithm="${signature.SignedInfo.SignatureMethod.$.Algorithm}"/>`,
            `<Reference URI="${signature.SignedInfo.Reference.$.URI}">`,
            '<Transforms>',
            `<Transform Algorithm="${signature.SignedInfo.Reference.Transforms.Transform[0].$.Algorithm}"/>`,
            `<Transform Algorithm="${signature.SignedInfo.Reference.Transforms.Transform[1].$.Algorithm}"/>`,
            '</Transforms>',
            `<DigestMethod Algorithm="${signature.SignedInfo.Reference.DigestMethod.$.Algorithm}"/>`,
            `<DigestValue>${signature.SignedInfo.Reference.DigestValue}</DigestValue>`,
            '</Reference>',
            '</SignedInfo>',
            `<SignatureValue>${signature.SignatureValue}</SignatureValue>`,
            '<KeyInfo><X509Data>',
            `<X509Certificate>${signature.KeyInfo.X509Data.X509Certificate}</X509Certificate>`,
            '</X509Data></KeyInfo>',
            '</Signature>',
          ].join(''),
        );
      },
      canonicalize: (xml: string) => xml,
    } as XmlToolkit;

    const certificateRepository = {
      sign: () => Promise.resolve(right('signed')),
      getStringCertificate: () => 'CERT',
    } as unknown as CertificateRepository;

    const signer = new MenuFiscalStreamXmlSigner(
      toolkit,
      certificateRepository,
      SignatureAlgorithm.SHA256,
    );

    const result = await signer.sign(sourcePath, destinationPath, {
      certificate: {},
    } as ReadCertificateResponse);

    expectIsRight(result);

    const expectedDigest = createHash(SignatureAlgorithm.SHA256)
      .update(MENU_FISCAL_CANONICAL_ROOT_OPEN)
      .update(menuFiscalCanonicalArquivoOpen(nroArquivo, data, hora))
      .update(cdata)
      .update(MENU_FISCAL_CANONICAL_CLOSE)
      .digest('base64');

    expect(capturedSignature).toStrictEqual({
      $: { xmlns: SignatureNamespace },
      SignedInfo: {
        CanonicalizationMethod: {
          $: { Algorithm: CanonicalizationMethod },
        },
        SignatureMethod: {
          $: { Algorithm: SignatureMethod.RSA_SHA256 },
        },
        Reference: {
          $: { URI: MENU_FISCAL_REFERENCE_URI },
          Transforms: {
            Transform: [
              {
                $: {
                  Algorithm:
                    'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
                },
              },
              {
                $: {
                  Algorithm:
                    'http://www.w3.org/TR/2001/REC-xml-c14n-20010315',
                },
              },
            ],
          },
          DigestMethod: {
            $: { Algorithm: DigestAlgorithm.SHA256 },
          },
          DigestValue: expectedDigest,
        },
      },
      SignatureValue: 'signed',
      KeyInfo: {
        X509Data: {
          X509Certificate: 'CERT',
        },
      },
    } satisfies Signature);

    const signed = await readFile(destinationPath, 'utf8');
    expect(signed).toContain(`URI="${MENU_FISCAL_REFERENCE_URI}"`);
    expect(signed).toContain(
      `CanonicalizationMethod Algorithm="${CanonicalizationMethod}"`,
    );
    expect(signed).toContain(
      `SignatureMethod Algorithm="${SignatureMethod.RSA_SHA256}"`,
    );
    expect(signed).toContain(
      `DigestMethod Algorithm="${DigestAlgorithm.SHA256}"`,
    );
    expect(signed).toContain(`<DigestValue>${expectedDigest}</DigestValue>`);
    expect(signed).toContain('<SignatureValue>signed</SignatureValue>');
    expect(signed).toContain(
      '<KeyInfo><X509Data><X509Certificate>CERT</X509Certificate></X509Data></KeyInfo>',
    );
    expect(signed).toContain('</Signature></menuFiscal>');
  });
});
