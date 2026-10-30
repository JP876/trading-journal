import { getDefaultStore } from 'jotai';

import { userAtom } from '../atoms/user';

export const getRandomInt = (min: number = 0, max: number = 1, roundTo?: number) => {
  let num = Math.floor(Math.random() * (max - min + 1)) + min;
  if (roundTo) num = Math.round(num / roundTo) * roundTo;
  return num;
};

export const getRandomItem = <T>(arr: T[]): T | null => {
  if (!arr.length) return null;
  return arr[Math.floor(Math.random() * arr.length)];
};

export const getRandomFloat = (min: number = 0, max: number = 1, roundTo?: number) => {
  let num = Math.random() * (max - min) + min;
  if (roundTo) num = Math.round(num / roundTo) * roundTo;
  return num;
};

export const getRandomNumArray = (length: number, min?: number, max?: number) => {
  return Array.from({ length }).map(() => getRandomFloat(min ?? 0, max || 1));
};

export const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
  const slope = (outMax - outMin) / (inMax - inMin);
  return (value - inMin) * slope + outMin;
};

export function decreasingLinearRange(start: number, end: number, count: number): number[] {
  if (start < end) throw new Error('start must be greater than or equal to end');
  if (!Number.isInteger(count) || count < 1) throw new Error('count must be a positive integer');

  if (count === 1) {
    if (start !== end) {
      throw new Error('count must be at least 2 when start and end differ');
    }
    return [start];
  }

  const step = (start - end) / (count - 1);
  return Array.from({ length: count }, (_, i) => Math.floor(start - step * i));
}

export const decreasingExponentialRange = (
  max: number,
  min: number,
  step: number,
  roundTo: number = 30,
  limit: number = 10
) => {
  if (max <= 0 || min <= 0) throw new Error('max and min must be positive');
  if (max < min) throw new Error('max must be greater than or equal to min');
  if (step <= 0) throw new Error('step must be greater than 0');

  const roundNum = (v: number) => Math.round(v / roundTo) * roundTo;
  const values = [max];
  const factor = Math.exp(-step);

  for (let value = max * factor; value > min; value *= factor) {
    const rounded = roundNum(value);
    if (rounded !== values[values.length - 1]) {
      values.push(rounded);
    }
  }

  const roundedMin = roundNum(min);
  if (roundedMin !== values[values.length - 1]) {
    values.push(roundedMin);
  }

  return Array.from({ length: limit }, (_, i) => {
    const index = Math.round((i * (values.length - 1)) / (limit - 1));
    return values[index];
  });
};

export const increasingRange = (min: number, max: number, step: number): number[] => {
  if (min > max) throw new Error('min must be less than or equal to max');
  if (step <= 0) throw new Error('step must be greater than 0');

  const values: number[] = [];

  for (let value = min; value < max; value += step) {
    values.push(value);
  }

  if (values[values.length - 1] !== max) {
    values.push(max);
  }

  return values;
};

export type TFormatToPips = {
  pipSize?: number;
  pair?: string;
  fraction?: number;
};

export const formatToPips = (firstPrice: number, secondPrice: number, options?: TFormatToPips): number => {
  let pipSize = 0.0001;

  if (options?.pipSize) {
    pipSize = options.pipSize;
  } else if (options?.pair && (options.pair.includes('JPY') || options.pair.includes('jpy'))) {
    pipSize = 0.01;
  }

  return +(Math.abs(firstPrice - secondPrice) / pipSize).toFixed(options?.fraction || 2);
};

export const formatCurrency = (value?: number, options?: Intl.NumberFormatOptions) => {
  if (!value) return '-';
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', ...(options || {}) }).format(value);
};

export const isGuest = () => getDefaultStore().get(userAtom)?.variety === 'GUEST';
