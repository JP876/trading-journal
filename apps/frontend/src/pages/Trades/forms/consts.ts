import { selectOptionType } from '@/types';

export const pairOptions: selectOptionType[] = [
  { label: 'EUR/USD', id: 'EUR/USD' },
  { label: 'USD/JPY', id: 'USD/JPY' },
  { label: 'EUR/JPY', id: 'EUR/JPY' },
  { label: 'AUD/JPY', id: 'AUD/JPY' },
  { label: 'GBP/USD', id: 'GBP/USD' },
  { label: 'AUD/USD', id: 'AUD/USD' },
  { label: 'USD/CAD', id: 'USD/CAD' },
  { label: 'USD/CHF', id: 'USD/CHF' },
  { label: 'NZD/USD', id: 'NZD/USD' },
  { label: 'EUR/GBP', id: 'EUR/GBP' },
];

export const directionItems: selectOptionType[] = [
  { label: 'BUY', id: 'buy' },
  { label: 'SELL', id: 'sell' },
];

export const resultItems: selectOptionType[] = [
  { label: 'WIN', id: 'win' },
  { label: 'BE', id: 'be' },
  { label: 'LOSS', id: 'loss' },
];
