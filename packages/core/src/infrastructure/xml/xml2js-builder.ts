import * as Xml2js from 'xml2js';

import {
  type BuilderOptions,
  type IBuilder,
} from 'src/domain/entities/xml/xml-builder';

import {
  defaultParserOptions,
  type ParserOptions,
} from 'src/domain/entities/xml/xml-parser';

export class Xml2JsBuilder implements IBuilder {
  public constructor(private readonly xml2js = Xml2js) {}

  parse<T>(xml: string, options?: ParserOptions): Promise<T> {
    options ??= defaultParserOptions;
    return new Promise((resolve, reject) =>
      new this.xml2js.Parser(options).parseString(xml, (err, result) =>
        err ? reject(err) : resolve(result as T),
      ),
    );
  }

  build(object: object, options?: BuilderOptions): Promise<string> {
    return Promise.resolve(
      new this.xml2js.Builder(options).buildObject(object),
    );
  }
}
