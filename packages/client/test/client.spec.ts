import {
  AccessKeyBuilder,
  StateCodes,
  Environment,
  NfeCstatToProtocol,
  type NFe,
  type InfNFe,
  type AccessKey,
} from '@nfets/client';

describe('@nfets/client (smoke)', () => {
  it('exports AccessKeyBuilder that compiles a 44-digit access key', () => {
    const accessKey = new AccessKeyBuilder().compile({
      cUF: 42,
      year: 25,
      month: 1,
      identification: '50181930000167',
      mod: '55',
      serie: 1,
      nNF: 12312,
      tpEmis: 1,
      cNF: 12837181,
    } satisfies AccessKey);

    expect(accessKey).toBe('42250150181930000167550010000123121128371816');
    expect(accessKey).toHaveLength(44);
  });

  it('exports Brazil constants used by NFe ide', () => {
    expect(StateCodes.SC).toBe('42');
    expect(Environment.Homolog).toBe('2');
  });

  it('exports NFe protocol cStat enum', () => {
    expect(NfeCstatToProtocol.Autorizada).toBe('100');
  });

  it('exposes NFe / InfNFe as structural types', () => {
    const nfe = {
      $: { xmlns: 'http://www.portalfiscal.inf.br/nfe' },
      infNFe: {
        $: { Id: 'NFe1', versao: '4.00' },
      } as InfNFe,
    } as NFe;

    expect(nfe.$.xmlns).toBe('http://www.portalfiscal.inf.br/nfe');
  });
});
