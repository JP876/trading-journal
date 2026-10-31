import { eurRates, usdRates } from '../consts';
import type { TCurrentRate } from '../types';

export type TFormatToPipsOptions = {
  pipSize?: number;
  pair?: string;
  fraction?: number;
};

export type TCalculateProfitOptions = {
  baseCurrency?: string;
  positionSize?: number;
  rates?: TCurrentRate[];
  fraction?: number;
};

class Price {
  static DEFAULT_CALCULATE_PROFIT_OPTIONS: Required<TCalculateProfitOptions> = {
    baseCurrency: 'EUR',
    positionSize: 10_000,
    rates: [],
    fraction: 4,
  };

  static getCurrentRates(baseCurrency: string) {
    switch (baseCurrency) {
      case 'EUR':
        return eurRates;
      case 'USD':
        return usdRates;
      default:
        throw new Error('Unsupported base currency');
    }
  }

  static getPipSize(pair?: string) {
    let pipSize = 0.0001;
    if (pair && (pair.endsWith('JPY') || pair.endsWith('jpy'))) {
      pipSize = 0.01;
    }
    return pipSize;
  }

  static formatToCurrency(value?: number, options?: Intl.NumberFormatOptions) {
    if (!value) return '-';

    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      ...(options || {}),
    }).format(value);
  }

  static formatToPips(firstPrice: number, secondPrice: number, options?: TFormatToPipsOptions) {
    const pipSize = Price.getPipSize(options?.pair);
    return +(Math.abs(firstPrice - secondPrice) / pipSize).toFixed(options?.fraction || 2);
  }

  static calculateProfit(
    pipsValue: number,
    pair: string, // EUR/USD, EUR/JPY
    options?: TCalculateProfitOptions
  ) {
    const positionSize = options?.positionSize || Price.DEFAULT_CALCULATE_PROFIT_OPTIONS.positionSize;
    const baseCurrency = options?.baseCurrency || Price.DEFAULT_CALCULATE_PROFIT_OPTIONS.baseCurrency;
    const fraction = options?.fraction || Price.DEFAULT_CALCULATE_PROFIT_OPTIONS.fraction;

    const pipSize = Price.getPipSize(pair);
    const value = pipsValue * pipSize * positionSize;

    const [, quote] = pair.split('/');
    if (!quote) {
      console.error(`Quote currency not found from pair: ${pair}`);
      return null;
    }

    if (quote === baseCurrency) return +value.toFixed(fraction);

    let rates: TCurrentRate[] = [];
    if (Array.isArray(options?.rates) && options.rates.length > 0) {
      rates = options.rates;
    } else {
      rates = Price.getCurrentRates(baseCurrency);
    }
    const rateInfo = rates.find((el) => el.currency === quote);

    if (!rateInfo) {
      console.error(`Current rate not found`);
      return null;
    }

    return +(value / rateInfo.rate).toFixed(fraction);
  }
}

export default Price;
