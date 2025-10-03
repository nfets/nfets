import type { NFeTsError } from 'src/domain/errors/nfets-error';
import type { BuilderOptions } from './xml-builder';
import type { ParserOptions } from './xml-parser';
import type { Either } from 'src/shared/either';
import type { CanonicalizeOptions } from './canonicalization';
import type { SignatureAlgorithm } from '../signer/algo';

export interface XmlToolkit {
  parse<T>(xml: string, options?: ParserOptions): Promise<T>;
  build(object: object, options?: BuilderOptions): Promise<string>;
  validate(
    xml: string,
    xsdPathReference: string,
    xsdFilename: string,
  ): Promise<Either<NFeTsError, void>>;
  canonicalize(xml: string, options?: CanonicalizeOptions): string;
  digest(
    xml: string,
    algorithm: SignatureAlgorithm,
    options?: CanonicalizeOptions,
  ): string;
  getNode(xml: string, tag: string): string | null;
  getAttribute(xml: string, tag: string): string | null;
  appendNode(xml: string, node: string): string;
}
