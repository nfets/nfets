export const defaultCanonicalizeOptions = {
  includeComments: false,
  exclusive: true,
} as CanonicalizeOptions;

export interface CanonicalizeOptions {
  includeComments: boolean;
  exclusive: boolean;
}
