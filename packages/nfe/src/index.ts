import type { InfNFe } from './entities/nfe/inf-nfe';
import type { Ide } from './entities/nfe/inf-nfe/ide';
import type { Emit } from './entities/nfe/inf-nfe/emit';
import type { Det } from './entities/nfe/inf-nfe/det';
import type { Pag } from './entities/nfe/inf-nfe/pag';

import { NfeXmlBuilder } from './application/xml-builder/nfe-xml-builder';
import { Xml2JsBuilder } from '@nfets/core';

export default (() => {
  const builder = new NfeXmlBuilder(new Xml2JsBuilder());
  const xml = builder
    .infNFe({} as InfNFe)
    .ide({} as Ide)
    .emit({} as Emit)
    .det([] as Det[])
    .pag({} as Pag)
    .assemble();

  console.log({ xml });
})();
