import { AutocompleteOptions } from '@/components/form/AutocompleteInput';
import { SelectInputOptionType } from '@/components/form/SelectInput';
import { SelectOptionType } from '@/types';
import { OrderType } from '@/types/trades';

export const pairOptions: AutocompleteOptions[] = [
  // Major currency pairs
  { label: 'EUR/USD', id: 'EUR/USD', groupBy: 'Major currency pairs' },
  { label: 'USD/JPY', id: 'USD/JPY', groupBy: 'Major currency pairs' },
  { label: 'GBP/USD', id: 'GBP/USD', groupBy: 'Major currency pairs' },
  { label: 'USD/CHF', id: 'USD/CHF', groupBy: 'Major currency pairs' },
  { label: 'AUD/USD', id: 'AUD/USD', groupBy: 'Major currency pairs' },
  { label: 'USD/CAD', id: 'USD/CAD', groupBy: 'Major currency pairs' },
  { label: 'NZD/USD', id: 'NZD/USD', groupBy: 'Major currency pairs' },
  { label: 'EUR/JPY', id: 'EUR/JPY', groupBy: 'Major currency pairs' },
  // Minor currency pairs
  { label: 'GBP/EUR ', id: 'GBP/EUR', groupBy: 'Minor currency pairs' },
  { label: 'EUR/GBP', id: 'EUR/GBP', groupBy: 'Minor currency pairs' },
  { label: 'EUR/CHF', id: 'EUR/CHF', groupBy: 'Minor currency pairs' },
  { label: 'GBP/JPY ', id: 'GBP/JPY ', groupBy: 'Minor currency pairs' },
  { label: 'CHF/JPY', id: 'CHF/JPY', groupBy: 'Minor currency pairs' },
  { label: 'AUD/JPY', id: 'AUD/JPY', groupBy: 'Minor currency pairs' },
  { label: 'CAD/JPY', id: 'CAD/JPY', groupBy: 'Minor currency pairs' },
  { label: 'NZD/JPY', id: 'NZD/JPY', groupBy: 'Minor currency pairs' },
  { label: 'AUD/NZD', id: 'AUD/NZD', groupBy: 'Minor currency pairs' },
  { label: 'AUD/CHF', id: 'AUD/CHF', groupBy: 'Minor currency pairs' },
  { label: 'GBP/CHF', id: 'GBP/CHF', groupBy: 'Minor currency pairs' },
  { label: 'CAD/CHF', id: 'CAD/CHF', groupBy: 'Minor currency pairs' },
  // Metal CFDs
  { label: 'XAU/USD', id: 'XAU/USD', groupBy: 'Metal CFDs' },
  { label: 'XAG/USD', id: 'XAG/USD', groupBy: 'Metal CFDs' },
];

export const directionItems: SelectOptionType[] = [
  { label: 'BUY', id: 'buy' },
  { label: 'SELL', id: 'sell' },
];

export const orderTypeItems: SelectInputOptionType[] = [
  { label: 'Market', id: OrderType.MARKET },
  { label: 'Pending order', id: 'pending-order', renderSubheader: true },
  {
    label: 'Sell limit',
    id: OrderType.SELL_LIMIT,
    menuItemProps: ({ watch }) => {
      const directionValue: 'buy' | 'sell' | undefined = watch('direction');
      return { disabled: directionValue === 'buy' };
    },
  },
  {
    label: 'Sell stop',
    id: OrderType.SELL_STOP,
    menuItemProps: ({ watch }) => {
      const directionValue: 'buy' | 'sell' | undefined = watch('direction');
      return { disabled: directionValue === 'buy' };
    },
  },
  {
    label: 'Buy limit',
    id: OrderType.BUY_LIMIT,
    menuItemProps: ({ watch }) => {
      const directionValue: 'buy' | 'sell' | undefined = watch('direction');
      return { disabled: directionValue === 'sell' };
    },
  },
  {
    label: 'Buy stop',
    id: OrderType.BUY_STOP,
    menuItemProps: ({ watch }) => {
      const directionValue: 'buy' | 'sell' | undefined = watch('direction');
      return { disabled: directionValue === 'sell' };
    },
  },
];

export const resultItems: SelectOptionType[] = [
  { label: 'WIN', id: 'win' },
  { label: 'BE', id: 'be' },
  { label: 'LOSS', id: 'loss' },
];
