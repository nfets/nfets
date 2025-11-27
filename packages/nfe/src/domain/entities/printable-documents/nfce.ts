export const mmToPt = 25.4 / 72;
export const mmToPx = 0.75;

export const DanfceSize = {
  '80mm': 80 / mmToPt,
  // '58mm': 58 / mmToPt, // TODO: support 58mm width
} as const;

export const defaultCreditsText = 'gerado por github.com/nfets/nfets';

export interface DanfceOptions {
  textFontSize: number;
  titleFontSize: number;
  width: keyof typeof DanfceSize;
  height: number;
  ignoreDefaultLogo?: boolean;
  logo?: string;
  credits?: string;
}

export interface QrCodeSvg {
  $: {
    xmlns: 'http://www.w3.org/2000/svg';
    width: string;
    height: string;
    viewBox: string;
  };
  path: {
    $: {
      d: string;
      fill?: string;
      stroke?: string;
    };
  }[];
}
