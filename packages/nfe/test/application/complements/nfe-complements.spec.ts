import { readFileSync } from 'node:fs';
import path from 'node:path';

import { NfeComplements } from '@nfets/nfe/application/complements/nfe-complements';
import { TpEvent } from '@nfets/nfe/domain/entities/constants/tp-event';
import { expectIsLeft, expectIsRight } from '@nfets/test/expects';

const chNFe = '42251103916076000583650670000011301672406275';

const nfeProcXml = readFileSync(
  path.join(
    __dirname,
    '../printable-documents/nfce/mocks/complete-xml-production-protocoled.xml',
  ),
  'utf-8',
);

const procEventoNFeXml = `<?xml version="1.0" encoding="UTF-8"?>
<procEventoNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="1.00">
  <evento xmlns="http://www.portalfiscal.inf.br/nfe" versao="1.00">
    <infEvento Id="ID${TpEvent.Cancelamento}${chNFe}01">
      <chNFe>${chNFe}</chNFe>
      <tpEvento>${TpEvent.Cancelamento}</tpEvento>
    </infEvento>
  </evento>
  <retEvento versao="1.00">
    <infEvento>
      <cStat>135</cStat>
      <tpEvento>${TpEvent.Cancelamento}</tpEvento>
      <chNFe>${chNFe}</chNFe>
      <nProt>342250000000001</nProt>
    </infEvento>
  </retEvento>
</procEventoNFe>`;

const retEnvEventoXml = `<?xml version="1.0" encoding="UTF-8"?>
<retEnvEvento versao="1.00">
  <cStat>128</cStat>
  <retEvento versao="1.00">
    <infEvento>
      <cStat>135</cStat>
      <tpEvento>${TpEvent.Cancelamento}</tpEvento>
      <chNFe>${chNFe}</chNFe>
      <nProt>342250000000002</nProt>
    </infEvento>
  </retEvento>
</retEnvEvento>`;

describe('nfe complements (unit)', () => {
  const complements = new NfeComplements();

  it('should append retEvento from procEventoNFe to nfeProc', () => {
    const result = complements.cancelRegister(nfeProcXml, procEventoNFeXml);

    expectIsRight(result);
    expect(result.value).toContain('<nfeProc');
    expect(result.value).toContain('<NFe');
    expect(result.value).toContain('<protNFe');
    expect(result.value).toContain('<retEvento');
    expect(result.value).toContain('<cStat>135</cStat>');
    expect(result.value).toContain(`<chNFe>${chNFe}</chNFe>`);
  });

  it('should append retEvento from retEnvEvento to nfeProc', () => {
    const result = complements.cancelRegister(nfeProcXml, retEnvEventoXml);

    expectIsRight(result);
    expect(result.value).toContain('<retEvento');
    expect(result.value).toContain('<nProt>342250000000002</nProt>');
  });

  it('should return left when nfe is not protocoladed', () => {
    const nfeWithoutProtocol = nfeProcXml.replace(
      /<protNFe[\s\S]*<\/protNFe>/,
      '',
    );

    const result = complements.cancelRegister(
      nfeWithoutProtocol,
      procEventoNFeXml,
    );

    expectIsLeft(result);
    expect(result.value.message).toContain('not protocoladed');
  });

  it('should return original nfe when cancellation has rejected cStat', () => {
    const rejectedCancellation = procEventoNFeXml.replace(
      '<cStat>135</cStat>',
      '<cStat>573</cStat>',
    );

    const result = complements.cancelRegister(nfeProcXml, rejectedCancellation);

    expectIsRight(result);
    expect(result.value).toBe(nfeProcXml);
    expect(result.value).not.toContain('<retEvento');
  });

  it('should return original nfe when cancellation chNFe differs', () => {
    const mismatchedCancellation = procEventoNFeXml.replaceAll(
      chNFe,
      '35240100000000000000550010000000011000000010',
    );

    const result = complements.cancelRegister(
      nfeProcXml,
      mismatchedCancellation,
    );

    expectIsRight(result);
    expect(result.value).toBe(nfeProcXml);
    expect(result.value).not.toContain('<retEvento');
  });
});
