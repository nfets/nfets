import type { NFeTsError } from 'src/domain/errors/nfets-error';
import type { Either } from 'src/shared/either';
import type { ParserOptions } from './xml-parser';

export interface XmlBuilder {
  parse<T>(xml: string, options?: ParserOptions): Promise<T>;
  build(object: object, options?: BuilderOptions): Promise<string>;
  validate(
    xml: string,
    xsdPathReference: string,
    xsdFilename: string,
  ): Promise<Either<NFeTsError, void>>;
}

export interface BuilderOptions {
  attrkey?: string;
  charkey?: string;
  rootName?: string;
  doctype?: 'xml';
  headless?: boolean;
  allowSurrogateChars?: boolean;
  cdata?: boolean;
}
