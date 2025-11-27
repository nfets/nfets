import fs from 'node:fs';
import path from 'node:path';
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

import { right } from '../../shared/either';
import { leftFromError } from '../../shared/left-from-error';

export class Xml2JsToolkit implements XmlToolkit {
  public constructor(private readonly xml2js = Xml2js) {
    setNodeDependencies({
      XMLSerializer: xmldom.XMLSerializer,
      DOMParser: xmldom.DOMParser,
      DOMImplementation: xmldom.DOMImplementation,
    });
  }

  public async validate(xml: string, xsd: string) {
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
    const parsed = XmlDsig.Parse(this.clear(xml));
    return new XmlDsig.XmlCanonicalizer(
      options.includeComments,
      options.exclusive,
    ).Canonicalize(parsed);
  }

  public getNode(xml: string, tag: string): string | null {
    const parsed = XmlDsig.Parse(xml);
    const element = parsed.documentElement.getElementsByTagName(tag).item(0);
    return element ? this.clear(XmlDsig.Stringify(element)) : null;
  }

  public getFirstNode(xml: string): string | null {
    const parsed = XmlDsig.Parse(xml);
    const element = parsed.documentElement.firstChild;
    return element ? this.clear(XmlDsig.Stringify(element)) : null;
  }

  public getAttribute(xml: string, tag: string): string | null {
    const parsed = XmlDsig.Parse(xml);
    return parsed.documentElement.getAttribute(tag);
  }

  public appendNode(xml: string, node: string): string {
    const parsed = XmlDsig.Parse(xml);
    const { documentElement } = XmlDsig.Parse(node);
    parsed.documentElement.appendChild(documentElement);
    return this.clear(XmlDsig.Stringify(parsed));
  }

  private hash(data: string, algorithm: SignatureAlgorithm): string {
    const hash = crypto.createHash(algorithm);
    return hash.update(data, 'utf8').digest().toString('base64');
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
