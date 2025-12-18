import type {
  AssembleNfeBuilder,
  IdeBuilder,
  InfNFeBuilder,
} from '@nfets/nfe/domain/entities/xml-builder/nfe-xml-builder';
import { NfeXmlBuilderPipeline } from './nfe-xml-builder-pipeline';
import { NfceXmlBuilder } from '../../xml-builder/nfce-xml-builder';

export class NfceXmlBuilderPipeline<
  T extends object,
> extends NfeXmlBuilderPipeline<T> {
  protected readonly builder:
    | (InfNFeBuilder<T> & IdeBuilder<T>)
    | AssembleNfeBuilder<T> = NfceXmlBuilder.create<T>(this.toolkit);
}
