import * as Xml2js from 'xml2js';

import {
  defaultParserOptions,
  type BuilderOptions,
  type IBuilder,
  type ParserOptions,
} from 'src/domain/entities/xml-builder';

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
