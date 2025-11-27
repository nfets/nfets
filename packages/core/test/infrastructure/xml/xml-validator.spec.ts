import path from 'node:path';
import { expectIsLeft, expectIsRight } from '@nfets/test/expects';
import {
  type Either,
  left,
  NFeTsError,
  Xml2JsToolkit,
} from '@nfets/core/index';

describe('xml validator (unit)', () => {
  const nfeNfceSchemas = path.resolve(
    __dirname,
    '../../../../',
    'nfe',
    'schemas',
    'PL_009_V4',
  );
  const xml = new Xml2JsToolkit();

  it('should return left when xml content is not provided', async () => {
    await expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (xml as any).validate(null) as Either<NFeTsError, void>,
    ).resolves.toStrictEqual(
      left(new NFeTsError('Please provide a valid xml content')),
    );
  });

  it('should return left when xsd path is not provided', async () => {
    await expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (xml as any).validate(
        '<?xml version="1.0" encoding="UTF-8"?>',
        null,
      ) as Either<NFeTsError, void>,
    ).resolves.toStrictEqual(
      left(new NFeTsError('Please provide a valid existing xsd path')),
    );
  });

  it('should return left when xml content is empty', async () => {
    const result = await xml.validate(
      '',
      `${nfeNfceSchemas}/consStatServ_v4.00.xsd`,
    );

    expectIsLeft(result);
    expect(result.value).toStrictEqual(
      new NFeTsError('Please provide a valid xml content'),
    );
  });

  it('should return left when xml content is invalid', async () => {
    const result = await xml.validate(
      'asiofhasiofh',
      `${nfeNfceSchemas}/consStatServ_v4.00.xsd`,
    );

    expectIsLeft(result);
    expect(result.value).toStrictEqual(
      new NFeTsError(`Error processing xml content, check if your xml is valid: noname.xml:1: parser error : Start tag expected, '<' not found
asiofhasiofh
^
`),
    );
  });

  it('should return left when xml content is invalid but has a valid opening tag', async () => {
    const result = await xml.validate(
      '<?xml version="1.0" encoding="UTF-8"?>asiofhasiofh',
      `${nfeNfceSchemas}/consStatServ_v4.00.xsd`,
    );

    expectIsLeft(result);
    expect(result.value).toStrictEqual(
      new NFeTsError(`Error processing xml content, check if your xml is valid: noname.xml:1: parser error : Start tag expected, '<' not found
<?xml version="1.0" encoding="UTF-8"?>asiofhasiofh
                                      ^
`),
    );
  });

  it('should return left when xml content is invalid but has a valid opening tag without a valid closing tag', async () => {
    const result = await xml.validate(
      '<?xml version="1.0" encoding="UTF-8"?><hello>world',
      `${nfeNfceSchemas}/consStatServ_v4.00.xsd`,
    );

    expectIsLeft(result);
    expect(result.value).toStrictEqual(
      new NFeTsError(`Error processing xml content, check if your xml is valid: noname.xml:1: parser error : Premature end of data in tag hello line 1
<?xml version="1.0" encoding="UTF-8"?><hello>world
                                                  ^
`),
    );
  });

  it('should return left when xml content is valid but it is not compatible with xsd scheme ', async () => {
    const consStatServ = await xml.build({
      consStatServ: {
        $: { versao: '4.00', xmlns: 'http://www.portalfiscal.inf.br/nfe' },
        cUF: '42',
        xServ: 'STATUS',
      },
    });

    const result = await xml.validate(
      consStatServ,
      `${nfeNfceSchemas}/consStatServ_v4.00.xsd`,
    );

    expectIsLeft(result);
    expect(result.value).toStrictEqual(
      new NFeTsError(
        `Invalid xml schema: Element '{http://www.portalfiscal.inf.br/nfe}cUF': This element is not expected. Expected is ( {http://www.portalfiscal.inf.br/nfe}tpAmb ).
`,
      ),
    );
  });

  it('should return right when xml content is valid and compatible with xsd scheme', async () => {
    const consStatServ = await xml.build({
      consStatServ: {
        $: { versao: '4.00', xmlns: 'http://www.portalfiscal.inf.br/nfe' },
        tpAmb: '2',
        cUF: '42',
        xServ: 'STATUS',
      },
    });

    const result = await xml.validate(
      consStatServ,
      `${nfeNfceSchemas}/consStatServ_v4.00.xsd`,
    );

    expectIsRight(result);
    expect(result.value).toBeUndefined();
  });
});
