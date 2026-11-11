import { exchangeRates } from "../consts";
import type { TCurrentRate } from "../types";

export type TFormatToPipsOptions = {
  pair?: string;
  fraction?: number;
};

export type TCalculateProfitOptions = {
  baseCurrency?: string;
  positionSize?: number;
  rates?: TCurrentRate[];
  fraction?: number;
};

const DEFAULT_CALCULATE_PROFIT_OPTIONS: Required<TCalculateProfitOptions> = {
  baseCurrency: "EUR",
  positionSize: 10_000,
  rates: [],
  fraction: 4,
};

export function getExchangeRates(baseCurrency: string) {
  switch (baseCurrency) {
    case "EUR":
      return exchangeRates.EUR;
    case "USD":
      return exchangeRates.USD;
    default:
      throw new Error("Unsupported base currency");
  }
}

export function getPipSize(pair?: string) {
  let pipSize = 0.0001;
  if (pair && (pair.endsWith("JPY") || pair.endsWith("jpy"))) {
    pipSize = 0.01;
  }
  return pipSize;
}

export function formatToCurrency(value?: number, options?: Intl.NumberFormatOptions) {
  if (!value) return "-";

  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    ...(options || {}),
  }).format(value);
}

export function formatToPips(
  firstPrice: number,
  secondPrice: number,
  options?: TFormatToPipsOptions,
) {
  const pipSize = getPipSize(options?.pair);
  return +(Math.abs(firstPrice - secondPrice) / pipSize).toFixed(options?.fraction || 2);
}

export function calculateProfit(
  pipsValue: number,
  pair: string, // EUR/USD, EUR/JPY
  options?: TCalculateProfitOptions,
) {
  const positionSize = options?.positionSize || DEFAULT_CALCULATE_PROFIT_OPTIONS.positionSize;
  const baseCurrency = options?.baseCurrency || DEFAULT_CALCULATE_PROFIT_OPTIONS.baseCurrency;
  const fraction = options?.fraction || DEFAULT_CALCULATE_PROFIT_OPTIONS.fraction;

  const pipSize = getPipSize(pair);
  const value = pipsValue * pipSize * positionSize;

  const [, quote] = pair.split("/");
  if (!quote) {
    console.error(`Quote currency not found from pair: ${pair}`);
    return null;
  }

  if (quote === baseCurrency) return +value.toFixed(fraction);

  let rates: TCurrentRate[] = [];
  if (Array.isArray(options?.rates) && options.rates.length > 0) {
    rates = options.rates;
  } else {
    rates = getExchangeRates(baseCurrency);
  }
  const rateInfo = rates.find((el) => el.currency === quote);

  if (!rateInfo) {
    console.error(`Current rate not found`);
    return null;
  }

  return +(value / rateInfo.rate).toFixed(fraction);
}
