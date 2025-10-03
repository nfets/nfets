export const defaultBuilderOptions = {
  xmldec: { version: '1.0', encoding: 'UTF-8', standalone: undefined },
} as BuilderOptions;

export interface XmlDeclarationAttributes {
  version: string;
  encoding?: string | undefined;
  standalone?: boolean | undefined;
}

export interface RenderOptions {
  pretty?: boolean | undefined;
  indent?: string | undefined;
  newline?: string | undefined;
}

export interface BuilderOptions {
  attrkey?: string | undefined;
  charkey?: string | undefined;
  rootName?: string | undefined;
  renderOpts?: RenderOptions | undefined;
  xmldec?: XmlDeclarationAttributes | undefined;
  doctype?: 'xml';
  headless?: boolean | undefined;
  allowSurrogateChars?: boolean | undefined;
  cdata?: boolean | undefined;
}
