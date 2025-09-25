export const defaultParserOptions = {
  explicitArray: false,
  explicitRoot: false,
  preserveChildrenOrder: true,
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
