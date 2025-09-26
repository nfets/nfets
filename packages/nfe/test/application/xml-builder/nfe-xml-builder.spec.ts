import { Xml2JsBuilder } from '@nfets/core';
import { NfeXmlBuilder } from 'src/application/xml-builder/nfe-xml-builder';

import {
  SkipAllValidations,
  SkipValidation,
} from 'src/application/validator/skip-validations';
import type { Ide } from 'src/entities/nfe/inf-nfe/ide';
import type { EmitBuilder } from 'src/entities/xml-builder/inf-nfe/emit-builder';

describe('xml builder with xml2js builder', () => {
  it('should completely ignores validations and sets the versao to [object Object]', async () => {
    @SkipAllValidations()
    class DontValidateNfeXmlBuilder extends NfeXmlBuilder {}

    const builder = DontValidateNfeXmlBuilder.create(new Xml2JsBuilder())
      .infNFe({ versao: { some: 'invalid-value' } as never })
      .ide({} as never)
      .emit({} as never)
      .det([])
      .pag({} as never);

    const xml = await builder.assemble();
    expect(xml).toBeDefined();
    expect(xml).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe>
  <infNFe versao="[object Object]">
    <ide/>
    <emit/>
  </infNFe>
</NFe>`);
  });

  it('should ignores only one method validation', async () => {
    class DontValidateNfeXmlBuilder extends NfeXmlBuilder {
      @SkipValidation()
      public ide(payload: Ide): EmitBuilder {
        return super.ide(payload);
      }
    }

    const builder = DontValidateNfeXmlBuilder.create(new Xml2JsBuilder())
      .infNFe({ versao: '4.00' })
      .ide({ mod: { invalid: 'model' } as never } as never)
      .emit({ xNome: 'xD', IE: '', CRT: '' } as never)
      .det([])
      .pag({} as never);

    const xml = await builder.assemble();

    expect(xml).toBeDefined();
    expect(xml).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe>
  <infNFe versao="4.00">
    <ide>
      <mod>
        <invalid>model</invalid>
      </mod>
    </ide>
    <emit>
      <xNome>xD</xNome>
      <IE/>
      <CRT/>
    </emit>
  </infNFe>
</NFe>`);
  });

  it('should throw exception when assemble an invalid nfe xml', async () => {
    const builder = NfeXmlBuilder.create(new Xml2JsBuilder())
      .infNFe({ versao: '4.00' })
      .ide({ mod: '55' } as never)
      .emit({} as never)
      .det([])
      .pag({} as never);

    await expect(async () => await builder.assemble()).rejects.toThrow(
      'ide.cUF must be a string, ide.cNF must be a string, ide.natOp must be a string, ide.serie must be a string, ide.nNF must be a string, ide.dhEmi must be a string, ide.tpNF must be a string, ide.idDest must be a string, ide.cMunFG must be a string, ide.tpImp must be a string, ide.tpEmis must be a string, ide.cDV must be a string, ide.tpAmb must be a string, ide.finNFe must be a string, ide.indFinal must be a string, ide.indPres must be a string, ide.procEmi must be a string, ide.verProc must be a string, emit.xNome must be a string, emit.IE must be a string, emit.CRT must be a string',
    );
  });

  it('should build a valid nfe xml with correct order and without undefined values', async () => {
    const builder = NfeXmlBuilder.create(new Xml2JsBuilder())
      .infNFe({ versao: '4.00' })
      .ide({
        cUF: '52',
        cNF: '78527251',
        natOp: 'Venda de mercadoria',
        mod: '55',
        serie: '99',
        nNF: '8018',
        dhEmi: '2024-06-12T06:55:26-03:00',
        dhSaiEnt: '2024-06-12T06:57:56-03:00',
        tpNF: '1',
        idDest: '2',
        cMunFG: '5212501',
        tpImp: '1',
        tpEmis: '1',
        cDV: '5',
        tpAmb: '2',
        finNFe: '1',
        indFinal: '0',
        indPres: '1',
        procEmi: '0',
        verProc: 'nfets-0.0.1',
      })
      .emit({
        CRT: '1',
        xNome: 'cliente de goias',
        CNPJ: '46755763000143',
        xFant: 'cliente de goias',
        IM: '123748',
        CNAE: '1234567',
        IE: '109381599',
        enderEmit: {
          xLgr: '14 897',
          nro: '13897',
          fone: '4934420122',
          xCpl: 'teste teste',
          CEP: '72831770',
          xMun: 'Luziania',
          UF: 'GO',
          cMun: '5212501',
          cPais: '1058',
          xBairro: 'Residencial Copaibas',
          xPais: void 0,
        },
      })
      .det([])
      .pag({} as never);

    const xml = await builder.assemble();

    expect(xml).toBeDefined();
    expect(xml).toStrictEqual(`<?xml version="1.0" encoding="UTF-8"?>
<NFe>
  <infNFe versao="4.00">
    <ide>
      <cUF>52</cUF>
      <cNF>78527251</cNF>
      <natOp>Venda de mercadoria</natOp>
      <mod>55</mod>
      <serie>99</serie>
      <nNF>8018</nNF>
      <dhEmi>2024-06-12T06:55:26-03:00</dhEmi>
      <dhSaiEnt>2024-06-12T06:57:56-03:00</dhSaiEnt>
      <tpNF>1</tpNF>
      <idDest>2</idDest>
      <cMunFG>5212501</cMunFG>
      <tpImp>1</tpImp>
      <tpEmis>1</tpEmis>
      <cDV>5</cDV>
      <tpAmb>2</tpAmb>
      <finNFe>1</finNFe>
      <indFinal>0</indFinal>
      <indPres>1</indPres>
      <procEmi>0</procEmi>
      <verProc>nfets-0.0.1</verProc>
    </ide>
    <emit>
      <CNPJ>46755763000143</CNPJ>
      <xNome>cliente de goias</xNome>
      <xFant>cliente de goias</xFant>
      <enderEmit>
        <xLgr>14 897</xLgr>
        <nro>13897</nro>
        <xCpl>teste teste</xCpl>
        <xBairro>Residencial Copaibas</xBairro>
        <cMun>5212501</cMun>
        <xMun>Luziania</xMun>
        <UF>GO</UF>
        <CEP>72831770</CEP>
        <cPais>1058</cPais>
        <fone>4934420122</fone>
      </enderEmit>
      <IE>109381599</IE>
      <IM>123748</IM>
      <CNAE>1234567</CNAE>
      <CRT>1</CRT>
    </emit>
  </infNFe>
</NFe>`);
  });
});
