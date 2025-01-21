export interface Params {
  name: string;
}

export const build = (params: Params) => console.log(params);

export { Xml2JsBuilder } from './infrastructure/xml2js-builder';
