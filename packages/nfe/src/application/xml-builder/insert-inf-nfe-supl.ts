export const escapeXmlText = (value: string): string => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

/**
 * Insere `infNFeSupl` na ordem do XSD (`leiauteNFe`): após `infNFe` e antes de `Signature`.
 * Se ainda não houver assinatura, insere após `infNFe` e antes de `</NFe>`.
 */
export const insertInfNFeSupl = (
  xml: string,
  qrCode: string,
  urlChave: string,
): string => {
  const block = `  <infNFeSupl>
    <qrCode>${escapeXmlText(qrCode)}</qrCode>
    <urlChave>${escapeXmlText(urlChave)}</urlChave>
  </infNFeSupl>
`;
  const withSignature = xml.replace(
    /(<\/infNFe>)\s*(<Signature\b)/,
    `$1\n${block}  $2`,
  );
  if (withSignature !== xml) return withSignature;

  return xml.replace(/(<\/infNFe>)\s*(<\/NFe>)/, `$1\n${block}  $2`);
};
