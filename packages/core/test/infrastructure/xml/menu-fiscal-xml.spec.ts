import {
  MENU_FISCAL_ARQ_BD,
  MENU_FISCAL_ARQ_SIST,
  menuFiscalCanonicalArquivoOpen,
} from '../../../src/infrastructure/xml/menu-fiscal-xml';

describe('menu-fiscal-xml (unit)', () => {
  it('should build canonical arquivo open tag with fixed attribute order', () => {
    expect(menuFiscalCanonicalArquivoOpen('1', '2026-11-26', '10:00:00')).toBe(
      `<arquivo arqBD="${MENU_FISCAL_ARQ_BD}" arqSist="${MENU_FISCAL_ARQ_SIST}" data="2026-11-26" hora="10:00:00" nroArquivo="1">`,
    );
  });
});
