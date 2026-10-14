import { db } from '../..';
import type { Trade } from '../../../../types/trade';
import { findMainTradingSession } from '../tradingSessions';
import type { ProfitabilityAnalysis, TradeWithDuration } from './types';

const formatDuration = (ms: number): string => {
  if (ms === 0) return '0s';

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;

  return `${seconds}s`;
};

const getBucketLabel = (ms: number, size = 30): string => {
  const totalMinutes = Math.floor(ms / 60000);
  const bucketIndex = Math.floor(totalMinutes / size);

  const start = bucketIndex * size;
  const end = start + size;

  return `${start}-${end}m`;
};

const calculateBuckets = (trades: { trade: Trade; duration: number }[], resultType: 'win' | 'loss') => {
  const buckets: { [key: string]: number } = {};
  const filtered = trades.filter((t) => t.trade.result === resultType);

  filtered.forEach(({ duration }) => {
    const label = getBucketLabel(duration);
    buckets[label] = (buckets[label] || 0) + 1;
  });

  return buckets;
};

const analyzeTradeDurations = (
  trades: TradeWithDuration[],
  options?: TradeDurationOptions
): ProfitabilityAnalysis | null => {
  if (trades.length === 0) return null;

  // Pre-calculate all durations once to avoid repeated .getTime() calls
  const tradesWithDuration = trades.map((trade) => {
    return {
      trade,
      duration: new Date(trade.closeDate).getTime() - new Date(trade.openDate).getTime(),
    };
  });

  const wins = tradesWithDuration.filter((t) => t.trade.result === 'win');
  const losses = tradesWithDuration.filter((t) => t.trade.result === 'loss');

  // Calculate Averages
  const totalWinDuration = wins.reduce((sum, t) => sum + t.duration, 0);
  const totalLossDuration = losses.reduce((sum, t) => sum + t.duration, 0);

  // Find Min/Max
  const fastestWin = wins.reduce((prev, curr) => (curr.duration < prev.duration ? curr : prev), wins[0]);
  const slowestWin = wins.reduce((prev, curr) => (curr.duration > prev.duration ? curr : prev), wins[0]);
  const fastestLoss = losses.reduce((prev, curr) => (curr.duration < prev.duration ? curr : prev), losses[0]);
  const slowestLoss = losses.reduce((prev, curr) => (curr.duration > prev.duration ? curr : prev), losses[0]);

  return {
    fastestWin: {
      durationMs: fastestWin?.duration || 0,
      durationFormatted: formatDuration(fastestWin?.duration || 0),
      trade: fastestWin?.trade as Trade,
    },
    slowestWin: {
      durationMs: slowestWin?.duration || 0,
      durationFormatted: formatDuration(slowestWin?.duration || 0),
      trade: slowestWin?.trade as Trade,
    },
    fastestLoss: {
      durationMs: fastestLoss?.duration || 0,
      durationFormatted: formatDuration(fastestLoss?.duration || 0),
      trade: fastestLoss?.trade as Trade,
    },
    slowestLoss: {
      durationMs: slowestLoss?.duration || 0,
      durationFormatted: formatDuration(slowestLoss?.duration || 0),
      trade: slowestLoss?.trade as Trade,
    },
    avgWinDuration: formatDuration(wins.length > 0 ? totalWinDuration / wins.length : 0),
    avgLossDuration: formatDuration(losses.length > 0 ? totalLossDuration / losses.length : 0),
    totalWins: wins.length,
    totalLosses: losses.length,
    // Call the separate bucket logic
    winBuckets: calculateBuckets(tradesWithDuration, 'win'),
    lossBuckets: calculateBuckets(tradesWithDuration, 'loss'),
  };
};

type TradeDurationOptions = {
  period?: string;
};

export const getTradeDurations = async (options?: TradeDurationOptions) => {
  const session = await findMainTradingSession();
  const trades = (await db.trades
    .where({ tradingSession: session.id })
    .filter((t) => !!(t.openDate && t.closeDate))
    .toArray()) as TradeWithDuration[];

  return analyzeTradeDurations(trades, options);
};
