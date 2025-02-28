import fs from 'node:fs';
import path from 'node:path';

import * as Xml2js from 'xml2js';
import validator from './xml-validator';

import {
  type BuilderOptions,
  type XmlBuilder,
} from 'src/domain/entities/xml/xml-builder';

import {
  defaultParserOptions,
  type ParserOptions,
} from 'src/domain/entities/xml/xml-parser';

import { right } from 'src/shared/either';
import { leftFromError } from 'src/shared/left-from-error';

export class Xml2JsBuilder implements XmlBuilder {
  public constructor(private readonly xml2js = Xml2js) {}

  async validate(xml: string, xsdPathReference: string, xsdFilename: string) {
    try {
      await validator.validate(
        xml,
        xsdPathReference,
        fs.readFileSync(path.resolve(xsdPathReference, xsdFilename), 'utf8'),
      );
      return right();
    } catch (e) {
      return leftFromError(e);
    }
  }

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
