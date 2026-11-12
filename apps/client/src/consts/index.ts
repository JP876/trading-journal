import type { TBaseCurrencyRates, TCurrentRate } from "../types";

export const defaultMsg = {
  error: "Something went wrong on our side. Please try again.",
};
export const AUTH_EVENT_TYPE = "auth";

export const exchangeRates: { [K in TBaseCurrencyRates]: TCurrentRate[] } = {
  EUR: [
    { currency: "USD", rate: 1.1172 },
    { currency: "JPY", rate: 175.68 },
    { currency: "GBP", rate: 0.8338 },
    { currency: "CHF", rate: 0.9194 },
    { currency: "CAD", rate: 1.5606 },
    { currency: "AUD", rate: 1.5904 },
    { currency: "NZD", rate: 1.9823 },
    { currency: "CNY", rate: 7.4326 },
    { currency: "SEK", rate: 10.978 },
    { currency: "NOK", rate: 10.312 },
    { currency: "DKK", rate: 7.4735 },
    { currency: "PLN", rate: 4.4038 },
  ],
  USD: [
    { currency: "EUR", rate: 0.895094 },
    { currency: "JPY", rate: 157.250269 },
    { currency: "GBP", rate: 0.746154 },
    { currency: "CHF", rate: 0.822771 },
    { currency: "CAD", rate: 1.396706 },
    { currency: "AUD", rate: 1.423236 },
    { currency: "NZD", rate: 1.774884 },
    { currency: "CNY", rate: 6.65163 },
    { currency: "SEK", rate: 9.827426 },
    { currency: "NOK", rate: 9.227712 },
    { currency: "DKK", rate: 6.68851 },
    { currency: "PLN", rate: 3.942894 },
  ],
};
