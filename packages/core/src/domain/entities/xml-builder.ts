export interface IBuilder {
  parse<T>(xml: string, options?: ParserOptions): Promise<T>;
  build(object: object, options?: BuilderOptions): Promise<string>;
}

export const defaultParserOptions = {
  explicitArray: false,
} as ParserOptions;

export interface ParserOptions {
  trim?: boolean;
  normalizeTags?: boolean;
  normalize?: boolean;
  explicitRoot?: boolean;
  xmlns?: boolean;
  explicitArray?: boolean;
  preserveChildrenOrder?: boolean;
  strict?: boolean;
  chunkSize?: number;
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
