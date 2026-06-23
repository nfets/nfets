import crypto from 'node:crypto';

import * as Xml2js from 'xml2js';
import * as XmlDsig from 'xmldsigjs';
import xmldom from '@xmldom/xmldom';
import { setNodeDependencies } from 'xml-core';

import validator from '../../infrastructure/xml/xml-validator';
import {
  type BuilderOptions,
  defaultBuilderOptions,
} from '../../domain/entities/xml/xml-builder';
import type { XmlToolkit } from '../../domain/entities/xml/xml-toolkit';
import {
  defaultCanonicalizeOptions,
  type CanonicalizeOptions,
} from '../../domain/entities/xml/canonicalization';
import type { SignatureAlgorithm } from '../../domain/entities/signer/algo';

import {
  defaultParserOptions,
  type ParserOptions,
} from '../../domain/entities/xml/xml-parser';

import { left, right } from '../../shared/either';
import { leftFromError } from '../../shared/left-from-error';
import { NFeTsError } from '@nfets/core/domain';

type XmlNode = {
  parentNode: XmlParentNode | null;
};

type XmlParentNode = {
  insertBefore<T extends XmlNode>(node: T, child: XmlNode | null): T;
};

type XmlNodeList<T> = {
  item(index: number): T | null;
};

type XmlElement = XmlNode & {
  firstChild: XmlNode | null;
  textContent: string | null;
  getAttribute(name: string): string | null;
  getElementsByTagName(tagName: string): XmlNodeList<XmlElement>;
  appendChild<T extends XmlNode>(node: T): T;
};

type XmlDocument = {
  documentElement: XmlElement | null;
};

export class Xml2JsToolkit implements XmlToolkit {
  public constructor(private readonly xml2js = Xml2js) {
    setNodeDependencies({
      XMLSerializer: xmldom.XMLSerializer,
      DOMParser: xmldom.DOMParser,
      DOMImplementation: xmldom.DOMImplementation,
    });
  }

  public async validate(xml: string, xsd: string) {
    if (!xml || xml.trim().length === 0) {
      return left(new NFeTsError('Please provide a valid xml content'));
    }

    if (!xsd || xsd.trim().length === 0) {
      return left(new NFeTsError('Please provide a valid existing xsd path'));
    }

    try {
      await validator.validate(xml, xsd);
      return right();
    } catch (e) {
      return leftFromError(e);
    }
  }

  public parse<T>(xml: string, options?: ParserOptions): Promise<T> {
    return new Promise((resolve, reject) =>
      new this.xml2js.Parser({
        ...defaultParserOptions,
        ...options,
      }).parseString(xml, (err, result) =>
        err ? reject(err) : resolve(result as T),
      ),
    );
  }

  public build(object: object, options?: BuilderOptions): Promise<string> {
    return Promise.resolve(
      new this.xml2js.Builder({
        ...defaultBuilderOptions,
        ...options,
      }).buildObject(object),
    );
  }

  public digest(
    xml: string,
    algorithm: SignatureAlgorithm,
    options = defaultCanonicalizeOptions,
  ): string {
    return this.hash(this.canonicalize(xml, options), algorithm);
  }

  public canonicalize(
    xml: string,
    options: CanonicalizeOptions = defaultCanonicalizeOptions,
  ): string {
    const parsed = new xmldom.DOMParser().parseFromString(
      this.clear(xml),
      'application/xml',
    );
    return new XmlDsig.XmlCanonicalizer(
      options.includeComments,
      options.exclusive,
    ).Canonicalize(parsed);
  }

  public getNode(xml: string, tag: string): string | null {
    const parsed = this.parseXml(xml);
    const root = this.getDocumentElement(parsed);
    const element = root.getElementsByTagName(tag).item(0);
    return element ? this.clear(this.serializeXml(element)) : null;
  }

  public getNodeValue(xml: string, tag: string): string | null {
    const parsed = this.parseXml(xml);
    const root = this.getDocumentElement(parsed);
    const element = root.getElementsByTagName(tag).item(0);
    const value = element?.textContent?.trim();
    return value ?? null;
  }

  public getNodes(xml: string, tag: string): string[] {
    const parsed = this.parseXml(xml);
    const root = this.getDocumentElement(parsed);
    const nodes = root.getElementsByTagName(tag);
    const result: string[] = [];

    for (let index = 0; ; index++) {
      const element = nodes.item(index);
      if (!element) break;
      result.push(this.clear(this.serializeXml(element)));
    }

    return result;
  }

  public getFirstNode(xml: string): string | null {
    const parsed = this.parseXml(xml);
    const root = this.getDocumentElement(parsed);
    const element = root.firstChild;
    return element ? this.clear(this.serializeXml(element)) : null;
  }

  public getAttribute(xml: string, tag: string): string | null {
    const parsed = this.parseXml(xml);
    return this.getDocumentElement(parsed).getAttribute(tag);
  }

  public appendNode(xml: string, node: string): string {
    const parsed = this.parseXml(xml);
    const root = this.getDocumentElement(parsed);
    const nodeRoot = this.getDocumentElement(this.parseXml(node));
    root.appendChild(nodeRoot);
    return this.clear(this.serializeXml(parsed));
  }

  public insertBefore(xml: string, referenceTag: string, node: string): string {
    const parsed = this.parseXml(xml);
    const root = this.getDocumentElement(parsed);
    const reference = root.getElementsByTagName(referenceTag).item(0);

    if (!reference?.parentNode)
      throw new NFeTsError(
        `No element found with tag "${referenceTag}" to insert before`,
      );

    const nodeRoot = this.getDocumentElement(this.parseXml(node));
    reference.parentNode.insertBefore(nodeRoot, reference);
    return this.clear(this.serializeXml(parsed));
  }

  private hash(data: string, algorithm: SignatureAlgorithm): string {
    const hash = crypto.createHash(algorithm);
    return hash.update(data, 'utf8').digest().toString('base64');
  }

  private parseXml(xml: string): XmlDocument {
    return new xmldom.DOMParser().parseFromString(
      xml,
      'application/xml',
    ) as XmlDocument;
  }

  private getDocumentElement(document: XmlDocument): XmlElement {
    if (!document.documentElement) {
      throw new NFeTsError('Invalid xml provided. Missing root element.');
    }

    return document.documentElement;
  }

  private serializeXml(node: XmlNode | XmlElement | XmlDocument): string {
    return new xmldom.XMLSerializer().serializeToString(node as never);
  }

  private clear(xml: string): string {
    const tokens = [
      'xmlns:default="http://www.w3.org/2000/09/xmldsig#"',
      ' standalone="no"',
      'default:',
      ':default',
      `\n`,
      `\r`,
      `\t`,
    ];

    return tokens.reduce(
      (acc, token) => acc.replace(token, ''),
      xml.replace(/(>)\s*(<)/gm, '$1$2'),
    );
  }
}
