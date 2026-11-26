export const MENU_FISCAL_ROOT = 'menuFiscal';
export const MENU_FISCAL_XMLNS = 'http://www.sef.sc.gov.br/nfce';
export const MENU_FISCAL_ARQUIVO_TAG = 'arquivo';
export const MENU_FISCAL_ARQ_BD = 'Banco de dados na nuvem';
export const MENU_FISCAL_ARQ_SIST = 'PAF-NFC-e Nuvem';
export const MENU_FISCAL_REFERENCE_URI = '';

export const MENU_FISCAL_CANONICAL_ROOT_OPEN = `<${MENU_FISCAL_ROOT} xmlns="${MENU_FISCAL_XMLNS}">`;
export const MENU_FISCAL_CANONICAL_CLOSE = `</${MENU_FISCAL_ARQUIVO_TAG}></${MENU_FISCAL_ROOT}>`;

export function menuFiscalCanonicalArquivoOpen(
  nroArquivo: string,
  data: string,
  hora: string,
): string {
  return `<${MENU_FISCAL_ARQUIVO_TAG} arqBD="${MENU_FISCAL_ARQ_BD}" arqSist="${MENU_FISCAL_ARQ_SIST}" data="${data}" hora="${hora}" nroArquivo="${nroArquivo}">`;
}
