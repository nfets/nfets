export type * from './domain/entities/calculator/decimal';
export type * from './domain/entities/xml/xml-builder';
export type * from './domain/entities/xml/xml-toolkit';
export type * from './shared/either';
export type * from './shared/types';

export { isLeft, isRight, left, right } from './shared/either';

export { NFeTsError } from './domain/errors/nfets-error';

export { Decimal } from './infrastructure/calculator/decimaljs';
export { Xml2JsToolkit } from './infrastructure/xml/xml2js-builder';
