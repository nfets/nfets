import { createRequire } from 'node:module';
import { addon } from '@nfets/core/shared/addon';
const require = createRequire(import.meta.url);

const validator = require(addon('xml_validator.node')) as XmlValidator;
export default validator;

declare interface XmlValidator {
  /**
   * validates a xml content against a xsd content
   *
   * @param xml xml contents
   * @param xsd xsd contents
   * @param xsdPathReference reference path for relative xsd includes
   * @returns `true` if xml is valid
   * @throws throws exception when xml does not follow the xsd schema
   */
  validate(xml: string, xsd: string): Promise<boolean>;

  /**
   * validates a xml content against a xsd content
   *
   * @param xml xml contents
   * @param xsd xsd contents
   * @param xsdPathReference reference path for relative xsd includes
   * @returns `true` if xml is valid
   * @throws throws exception when xml does not follow the xsd schema
   */
  validateSync(xml: string, xsd: string): boolean;
}
