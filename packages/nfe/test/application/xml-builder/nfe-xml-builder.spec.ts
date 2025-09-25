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

  it('should build a valid nfe xml', async () => {
    const builder = NfeXmlBuilder.create(new Xml2JsBuilder())
      .infNFe({ versao: '4.00' })
      .ide({ mod: '55' } as never)
      .emit({} as never)
      .det([])
      .pag({} as never);

    const xml = await builder.assemble();
    console.log({ xml });
    expect(xml).toBeDefined();
  });
});
