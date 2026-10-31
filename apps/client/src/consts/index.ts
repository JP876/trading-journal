import type { TCurrentRate } from '../types';

export const defaultMsg = {
  error: 'Something went wrong on our side. Please try again.',
};

// rates as of 30.10.26
export const eurRates: TCurrentRate[] = [
  { pair: 'EUR/USD', currency: 'USD', rate: 1.1172 },
  { pair: 'EUR/JPY', currency: 'JPY', rate: 175.68 },
  { pair: 'EUR/GBP', currency: 'GBP', rate: 0.8338 },
  { pair: 'EUR/CHF', currency: 'CHF', rate: 0.9194 },
  { pair: 'EUR/CAD', currency: 'CAD', rate: 1.5606 },
  { pair: 'EUR/AUD', currency: 'AUD', rate: 1.5904 },
  { pair: 'EUR/NZD', currency: 'NZD', rate: 1.9823 },
  { pair: 'EUR/CNY', currency: 'CNY', rate: 7.4326 },
  { pair: 'EUR/SEK', currency: 'SEK', rate: 10.978 },
  { pair: 'EUR/NOK', currency: 'NOK', rate: 10.312 },
  { pair: 'EUR/DKK', currency: 'DKK', rate: 7.4735 },
  { pair: 'EUR/PLN', currency: 'PLN', rate: 4.4038 },
];

// rates as of 30.10.26
export const usdRates: TCurrentRate[] = [
  { pair: 'USD/EUR', currency: 'EUR', rate: 0.895094 },
  { pair: 'USD/JPY', currency: 'JPY', rate: 157.250269 },
  { pair: 'USD/GBP', currency: 'GBP', rate: 0.746154 },
  { pair: 'USD/CHF', currency: 'CHF', rate: 0.822771 },
  { pair: 'USD/CAD', currency: 'CAD', rate: 1.396706 },
  { pair: 'USD/AUD', currency: 'AUD', rate: 1.423236 },
  { pair: 'USD/NZD', currency: 'NZD', rate: 1.774884 },
  { pair: 'USD/CNY', currency: 'CNY', rate: 6.65163 },
  { pair: 'USD/SEK', currency: 'SEK', rate: 9.827426 },
  { pair: 'USD/NOK', currency: 'NOK', rate: 9.227712 },
  { pair: 'USD/DKK', currency: 'DKK', rate: 6.68851 },
  { pair: 'USD/PLN', currency: 'PLN', rate: 3.942894 },
];
