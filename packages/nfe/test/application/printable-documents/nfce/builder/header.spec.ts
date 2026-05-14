import type { DanfcePdfDocument } from '@nfets/nfe/application/printable-documents/nfce/danfce';
import type { Emit } from '@nfets/nfe/domain/entities/nfe/inf-nfe/emit';

import { Header } from '@nfets/nfe/application/printable-documents/nfce/builder/header';
import { getDanfcePdfDocumentMock } from '../mocks/get-danfce-pdf-document-mock';

class TestableHeader extends Header {
  public static create(context: DanfcePdfDocument) {
    return new TestableHeader(context);
  }

  public cpfOrCnpjPublic(emit: Emit) {
    return this.cpfOrCnpj(emit);
  }
}

describe('Header test', () => {
  const mockContext = getDanfcePdfDocumentMock();
  mockContext.data.infNFe.emit.CNPJ = 'VYNSLMR6000122';

  const service = TestableHeader.create(mockContext);

  it('should format alphanumeric CNPJ', () => {
    expect(service.cpfOrCnpjPublic(mockContext.data.infNFe.emit)).toBe(
      'CNPJ VY.NSL.MR6/0001-22',
    );
  });
});
