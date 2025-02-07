import type { ParserOptions } from './xml-parser';

export interface IBuilder {
  parse<T>(xml: string, options?: ParserOptions): Promise<T>;
  build(object: object, options?: BuilderOptions): Promise<string>;
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
