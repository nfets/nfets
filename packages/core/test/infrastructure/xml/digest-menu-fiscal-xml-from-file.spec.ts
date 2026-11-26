import { createHash } from 'node:crypto';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { SignatureAlgorithm } from '../../../src/domain/entities/signer/algo';
import { NFeTsError } from '../../../src/domain/errors/nfets-error';
import { digestMenuFiscalXmlFromFile } from '../../../src/infrastructure/xml/digest-menu-fiscal-xml-from-file';
import {
  MENU_FISCAL_CANONICAL_CLOSE,
  MENU_FISCAL_CANONICAL_ROOT_OPEN,
  menuFiscalCanonicalArquivoOpen,
} from '../../../src/infrastructure/xml/menu-fiscal-xml';
import { expectIsLeft, expectIsRight } from '@nfets/test/expects';

describe('digestMenuFiscalXmlFromFile (unit)', () => {
  let directory: string;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'nfets-digest-menu-fiscal-'));
  });

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  it('should digest canonical menuFiscal content from file', async () => {
    const sourcePath = join(directory, 'menu-fiscal.xml');
    const nroArquivo = '42';
    const data = '2026-11-26';
    const hora = '11:00:00';
    const cdata = 'YWJjZA==';

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

    const result = await digestMenuFiscalXmlFromFile(
      sourcePath,
      SignatureAlgorithm.SHA256,
    );

    expectIsRight(result);

    const expected = createHash(SignatureAlgorithm.SHA256)
      .update(MENU_FISCAL_CANONICAL_ROOT_OPEN)
      .update(menuFiscalCanonicalArquivoOpen(nroArquivo, data, hora))
      .update(cdata)
      .update(MENU_FISCAL_CANONICAL_CLOSE)
      .digest('base64');

    expect(result.value).toBe(expected);
  });

  it('should return left when arquivo attributes are missing', async () => {
    const sourcePath = join(directory, 'menu-fiscal.xml');
    await writeFile(
      sourcePath,
      '<menuFiscal><arquivo><![CDATA[abc]]></arquivo></menuFiscal>',
      'utf8',
    );

    const result = await digestMenuFiscalXmlFromFile(
      sourcePath,
      SignatureAlgorithm.SHA256,
    );

    expectIsLeft(result);
    expect(result.value).toStrictEqual(
      new NFeTsError(
        'nroArquivo, data or hora missing on arquivo in menuFiscal',
      ),
    );
  });

  it('should return left when CDATA is not closed', async () => {
    const sourcePath = join(directory, 'menu-fiscal.xml');
    await writeFile(
      sourcePath,
      '<menuFiscal><arquivo nroArquivo="1" data="2026-11-26" hora="11:00:00"><![CDATA[abc</arquivo></menuFiscal>',
      'utf8',
    );

    const result = await digestMenuFiscalXmlFromFile(
      sourcePath,
      SignatureAlgorithm.SHA256,
    );

    expectIsLeft(result);
    expect(result.value).toStrictEqual(
      new NFeTsError('CDATA is not closed in menuFiscal'),
    );
  });
});
