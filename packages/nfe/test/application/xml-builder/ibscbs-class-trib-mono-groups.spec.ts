import { Xml2JsToolkit } from '@nfets/core/infrastructure';
import { Decimal } from '@nfets/core/infrastructure';
import { NfeXmlBuilder } from '@nfets/nfe/application/xml-builder/nfe-xml-builder';
import type { IBSCBS } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs';
import type { IBSCBSMono } from '@nfets/nfe/domain/entities/nfe/inf-nfe/det/imposto/ibscbs/ibscbs-mono';
import Schemas from '@nfets/nfe/domain/entities/transmission/schemas';
import { expectIsRight } from '@nfets/test/expects';
import {
  createValidEmit,
  createValidIde,
  createValidItems,
  createValidPag,
  createValidTransp,
} from '../../fixtures/data';
import {
  CLASS_TRIB_MONO,
  expectedGroups,
  getClassTribMono,
  type ClassTribMonoFlags,
  type MonoRegime,
} from '../../fixtures/ibscbs-class-trib-mono';

const toolkit = new Xml2JsToolkit();

function buildMono(flags: ClassTribMonoFlags, regime: MonoRegime): IBSCBSMono {
  const mono: IBSCBSMono = {
    vTotIBSMonoItem: '1.50',
    vTotCBSMonoItem: '9.00',
  };

  const hasAny =
    flags.indGMonoNormal ||
    flags.indGMonoReten ||
    flags.indGMonoRet ||
    flags.indGpBioDiferenca;

  if (!hasAny) return mono;

  if (regime === 'adRem') {
    mono.gIBSMonoAdRem = {
      ...(flags.indGMonoNormal
        ? {
            gMonoPadrao: {
              qBCMono: '10.0000',
              adRemIBS: '0.1500',
              vIBSMono: '1.50',
            },
          }
        : {}),
      ...(flags.indGMonoReten
        ? {
            gMonoReten: {
              qBCMonoReten: '10.0000',
              adRemIBSReten: '0.1000',
              vIBSMonoReten: '1.00',
            },
          }
        : {}),
      ...(flags.indGMonoRet ? { gMonoRet: { vIBSMonoRet: '1.20' } } : {}),
      ...(flags.indGpBioDiferenca
        ? {
            gpBioDiferenca: {
              qBCBioComb: '2.0000',
              vIBSDiferenca: '0.30',
            },
          }
        : {}),
    };

    mono.gCBSMonoAdRem = {
      ...(flags.indGMonoNormal
        ? {
            gMonoPadrao: {
              qBCMono: '10.0000',
              adRemCBS: '0.9000',
              vCBSMono: '9.00',
            },
          }
        : {}),
      ...(flags.indGMonoReten
        ? {
            gMonoReten: {
              qBCMonoReten: '10.0000',
              adRemCBSReten: '0.8000',
              vCBSMonoReten: '8.00',
            },
          }
        : {}),
      ...(flags.indGMonoRet ? { gMonoRet: { vCBSMonoRet: '0.80' } } : {}),
      ...(flags.indGpBioDiferenca
        ? {
            gpBioDiferenca: {
              qBCBioComb: '2.0000',
              vCBSDiferenca: '1.80',
            },
          }
        : {}),
    };

    return mono;
  }

  mono.gIBSMonoAdValorem = {
    ...(flags.indGMonoNormal
      ? {
          gMonoPadrao: {
            vBCMono: '100.00',
            pAliqMonoUF: '0.1000',
            vIBSMonoUF: '0.10',
            pAliqMonoMun: '0.0500',
            vIBSMonoMun: '0.05',
            vIBSMono: '0.15',
          },
        }
      : {}),
    ...(flags.indGMonoReten
      ? {
          gMonoReten: {
            vBCMonoReten: '100.00',
            pAliqMonoReten: '0.1000',
            vIBSMonoReten: '0.10',
          },
        }
      : {}),
    ...(flags.indGMonoRet ? { gMonoRet: { vIBSMonoRet: '1.20' } } : {}),
    ...(flags.indGpBioDiferenca
      ? {
          gpBioDiferenca: {
            qBCBioComb: '2.0000',
            vIBSDiferenca: '0.30',
          },
        }
      : {}),
  };

  mono.gCBSMonoAdValorem = {
    ...(flags.indGMonoNormal
      ? {
          gMonoPadrao: {
            vBCMono: '100.00',
            pAliqMonoCBS: '0.9000',
            vCBSMono: '0.90',
          },
        }
      : {}),
    ...(flags.indGMonoReten
      ? {
          gMonoReten: {
            vBCMonoReten: '100.00',
            pAliqMonoReten: '0.8000',
            vCBSMonoReten: '0.80',
          },
        }
      : {}),
    ...(flags.indGMonoRet ? { gMonoRet: { vCBSMonoRet: '0.80' } } : {}),
    ...(flags.indGpBioDiferenca
      ? {
          gpBioDiferenca: {
            qBCBioComb: '2.0000',
            vCBSDiferenca: '1.80',
          },
        }
      : {}),
  };

  return mono;
}

function buildIbscbs(flags: ClassTribMonoFlags, regime: MonoRegime): IBSCBS {
  return {
    CST: '620',
    cClassTrib: flags.code,
    gIBSCBSMono: buildMono(flags, regime),
  };
}

async function assembleXml(ibscbs: IBSCBS): Promise<string> {
  const builder = NfeXmlBuilder.create(toolkit, undefined, Schemas.PL_010_V1_30)
    .infNFe({ versao: '4.00' })
    .ide(createValidIde())
    .emit(createValidEmit())
    .det(createValidItems(), (ctx, item) =>
      ctx
        .prod({
          cProd: item.code,
          cEAN: 'SEM GTIN',
          xProd: item.description,
          NCM: '00',
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
            orig: '1',
            CST: '00',
            modBC: '0',
            vBC: '100',
            pICMS: 18.0,
            vICMS: Decimal.from('18').toString(),
          },
        })
        .pis({ PISNT: { CST: '08' } })
        .cofins({ COFINSNT: { CST: '08' } })
        .ibscbs(ibscbs)
        .vItem({ vItem: '100.00' }),
    )
    .transp(createValidTransp())
    .pag(createValidPag());

  const xml = await builder.assemble();
  expectIsRight(xml);
  return xml.value;
}

function expectTag(xml: string, tag: string, present: boolean) {
  const open = `<${tag}>`;
  if (present) {
    expect(xml).toContain(open);
  } else {
    expect(xml).not.toContain(open);
  }
}

describe('IBSCBS gIBSCBSMono by cClassTrib (NT 2025.002)', () => {
  describe.each(['adValorem', 'adRem'] as const)('regime %s', (regime) => {
    it.each(CLASS_TRIB_MONO)(
      'cClassTrib $code emits expected mono groups',
      async (flags) => {
        const expected = expectedGroups(flags, regime);
        const xml = await assembleXml(buildIbscbs(flags, regime));

        expect(xml).toContain(`<cClassTrib>${flags.code}</cClassTrib>`);
        expect(xml).toContain('<CST>620</CST>');
        expect(xml).toContain('<gIBSCBSMono>');
        expect(xml).toContain('<vTotIBSMonoItem>');
        expect(xml).toContain('<vTotCBSMonoItem>');

        expectTag(xml, 'gIBSMonoAdRem', expected.gIBSMonoAdRem);
        expectTag(xml, 'gIBSMonoAdValorem', expected.gIBSMonoAdValorem);
        expectTag(xml, 'gCBSMonoAdRem', expected.gCBSMonoAdRem);
        expectTag(xml, 'gCBSMonoAdValorem', expected.gCBSMonoAdValorem);

        expectTag(xml, 'gMonoPadrao', expected.gMonoPadrao);
        expectTag(xml, 'gMonoReten', expected.gMonoReten);
        expectTag(xml, 'gMonoRet', expected.gMonoRet);
        expectTag(xml, 'gpBioDiferenca', expected.gpBioDiferenca);

        if (expected.gMonoPadrao && regime === 'adValorem') {
          expect(xml).toContain('<pAliqMonoUF>');
          expect(xml).toContain('<pAliqMonoMun>');
          expect(xml).toContain('<pAliqMonoCBS>');
          expect(xml).not.toContain('<adRemIBS>');
          expect(xml).not.toContain('<adRemCBS>');
        }

        if (expected.gMonoPadrao && regime === 'adRem') {
          expect(xml).toContain('<adRemIBS>');
          expect(xml).toContain('<adRemCBS>');
          expect(xml).toContain('<qBCMono>');
          expect(xml).not.toContain('<pAliqMonoUF>');
          expect(xml).not.toContain('<pAliqMonoCBS>');
        }

        if (expected.gpBioDiferenca) {
          expect(xml).toContain('<qBCBioComb>');
          expect(xml).toContain('<vIBSDiferenca>');
          expect(xml).toContain('<vCBSDiferenca>');
        }
      },
    );
  });

  it('does not mix Ad Rem and Ad Valorem for the same tax on 620001', async () => {
    const flags = getClassTribMono('620001');
    const adValoremXml = await assembleXml(buildIbscbs(flags, 'adValorem'));
    const adRemXml = await assembleXml(buildIbscbs(flags, 'adRem'));

    expect(adValoremXml).toContain('<gIBSMonoAdValorem>');
    expect(adValoremXml).not.toContain('<gIBSMonoAdRem>');
    expect(adRemXml).toContain('<gIBSMonoAdRem>');
    expect(adRemXml).not.toContain('<gIBSMonoAdValorem>');
  });

  it('620002 includes both padrao and reten under the same Ad Valorem parent', async () => {
    const flags = getClassTribMono('620002');
    const xml = await assembleXml(buildIbscbs(flags, 'adValorem'));

    expect(xml).toContain('<gIBSMonoAdValorem>');
    expect(xml).toContain('<gMonoPadrao>');
    expect(xml).toContain('<gMonoReten>');
    expect(xml).not.toContain('<gMonoRet>');
    expect(xml).not.toContain('<gpBioDiferenca>');
  });

  it('620004/620005 emit ret + gpBio without padrao/reten', async () => {
    for (const code of ['620004', '620005'] as const) {
      const flags = getClassTribMono(code);
      const xml = await assembleXml(buildIbscbs(flags, 'adValorem'));

      expect(xml).toContain(`<cClassTrib>${code}</cClassTrib>`);
      expect(xml).toContain('<gMonoRet>');
      expect(xml).toContain('<gpBioDiferenca>');
      expect(xml).not.toContain('<gMonoPadrao>');
      expect(xml).not.toContain('<gMonoReten>');
    }
  });
});
