export type Pair = {
  id: number;
  pair: string;
  assetClass: 'forex_major' | 'forex_minor' | 'forex_exotic' | 'commodity' | 'crypto';
  baseIso: string;
  quoteIso: string;
  baseCountry: string;
  quoteCountry: string;
  baseCurrencyName: string;
  quoteCurrencyName: string;
};
