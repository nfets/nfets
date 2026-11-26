import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';

import type { SignatureAlgorithm } from '../../domain/entities/signer/algo';
import { NFeTsError } from '../../domain/errors/nfets-error';
import { type Either, left, right } from '../../shared/either';
import {
  MENU_FISCAL_CANONICAL_CLOSE,
  MENU_FISCAL_CANONICAL_ROOT_OPEN,
  menuFiscalCanonicalArquivoOpen,
} from './menu-fiscal-xml';

const CDATA_OPEN = '<![CDATA[';
const CDATA_CLOSE = ']]>';
const ARQUIVO_START = '<arquivo';
const ATTR_NRO_ARQUIVO = /nroArquivo="([^"]*)"/;
const ATTR_DATA = /data="([^"]*)"/;
const ATTR_HORA = /hora="([^"]*)"/;

export async function digestMenuFiscalXmlFromFile(
  filePath: string,
  algorithm: SignatureAlgorithm,
): Promise<Either<NFeTsError, string>> {
  const hash = createHash(algorithm);
  let buffer = '';
  let phase: 'header' | 'cdata' | 'done' = 'header';

  for await (const chunk of createReadStream(filePath, { encoding: 'utf8' })) {
    buffer += String(chunk);

    if (phase === 'header') {
      const header = takeHeader(buffer);
      if (header.kind === 'need-more') {
        buffer = header.buffer;
        continue;
      }

      if (header.kind === 'error') return left(header.error);

      hash.update(MENU_FISCAL_CANONICAL_ROOT_OPEN);
      hash.update(
        menuFiscalCanonicalArquivoOpen(
          header.nroArquivo,
          header.data,
          header.hora,
        ),
      );
      buffer = header.buffer;
      phase = 'cdata';
    }

    const consumed = consumeBase64Cdata(hash, buffer);
    if (consumed.kind === 'need-more') {
      buffer = consumed.buffer;
      continue;
    }

    if (consumed.kind === 'error') return left(consumed.error);

    hash.update(MENU_FISCAL_CANONICAL_CLOSE);
    phase = 'done';
    break;
  }

  if (phase === 'cdata') {
    const consumed = consumeBase64Cdata(hash, buffer, true);
    if (consumed.kind === 'error') return left(consumed.error);
    if (consumed.kind === 'need-more') {
      return left(new NFeTsError('CDATA is not closed in menuFiscal'));
    }

    hash.update(MENU_FISCAL_CANONICAL_CLOSE);
    phase = 'done';
  }

  if (phase !== 'done') {
    return left(new NFeTsError('menuFiscal arquivo header not found'));
  }

  return right(hash.digest('base64'));
}

type HeaderResult =
  | { kind: 'need-more'; buffer: string }
  | {
      kind: 'found';
      buffer: string;
      nroArquivo: string;
      data: string;
      hora: string;
    }
  | { kind: 'error'; error: NFeTsError };

function takeHeader(input: string): HeaderResult {
  const cdataAt = input.indexOf(CDATA_OPEN);
  if (cdataAt < 0) {
    return { kind: 'need-more', buffer: input };
  }

  const header = input.slice(0, cdataAt);
  const arquivoAt = header.indexOf(ARQUIVO_START);
  if (arquivoAt < 0) {
    return {
      kind: 'error',
      error: new NFeTsError('arquivo start tag not found in menuFiscal'),
    };
  }

  const tagEnd = header.indexOf('>', arquivoAt);
  if (tagEnd < 0) {
    return {
      kind: 'error',
      error: new NFeTsError('arquivo start tag is not closed in menuFiscal'),
    };
  }

  const attrs = header.slice(arquivoAt, tagEnd);
  const nroArquivo = ATTR_NRO_ARQUIVO.exec(attrs)?.[1];
  const data = ATTR_DATA.exec(attrs)?.[1];
  const hora = ATTR_HORA.exec(attrs)?.[1];

  if (!nroArquivo || !data || !hora) {
    return {
      kind: 'error',
      error: new NFeTsError(
        'nroArquivo, data or hora missing on arquivo in menuFiscal',
      ),
    };
  }

  return {
    kind: 'found',
    buffer: input.slice(cdataAt + CDATA_OPEN.length),
    nroArquivo,
    data,
    hora,
  };
}

type CdataResult =
  | { kind: 'need-more'; buffer: string }
  | { kind: 'done' }
  | { kind: 'error'; error: NFeTsError };

function consumeBase64Cdata(
  hash: { update(data: string): void },
  input: string,
  finalized = false,
): CdataResult {
  const closeAt = input.indexOf(CDATA_CLOSE);
  if (closeAt >= 0) {
    if (closeAt > 0) hash.update(input.slice(0, closeAt));
    return { kind: 'done' };
  }

  if (finalized) {
    return {
      kind: 'error',
      error: new NFeTsError('CDATA is not closed in menuFiscal'),
    };
  }

  const keep = CDATA_CLOSE.length - 1;
  if (input.length > keep) {
    hash.update(input.slice(0, -keep));
    return { kind: 'need-more', buffer: input.slice(-keep) };
  }

  return { kind: 'need-more', buffer: input };
}
