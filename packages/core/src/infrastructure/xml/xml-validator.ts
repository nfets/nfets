import path from 'node:path';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const validator = require(path.join(
  process.env.NFETS_ADDONS_DIR ?? '',
  'xml_validator.node',
)) as XmlValidator;

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
  validate(
    xml: string,
    xsd: string,
    xsdPathReference: string,
  ): Promise<boolean>;

  /**
   * validates a xml content against a xsd content
   *
   * @param xml xml contents
   * @param xsd xsd contents
   * @param xsdPathReference reference path for relative xsd includes
   * @returns `true` if xml is valid
   * @throws throws exception when xml does not follow the xsd schema
   */
  validateSync(xml: string, xsd: string, xsdPathReference: string): boolean;
}
