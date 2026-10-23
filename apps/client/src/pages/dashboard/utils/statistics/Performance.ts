import type { Trade } from '../../../../types/trade';
import type { Statistic, TStatistic } from '../types';
import type CountTradesStatistic from './CountTrades';

class PerformanceStatistic implements Statistic {
  finalProft: number = 0;
  returnPercentage: number = 0;
  avgProft: TStatistic = { all: null, long: null, short: null };
  avgLoss: TStatistic = { all: null, long: null, short: null };

  private accountSize: number = 0;

  constructor(accountSize: number) {
    this.accountSize = accountSize;
  }

  update(trade: Trade | null, count: CountTradesStatistic): void {
    if (!trade || typeof trade.profit !== 'number') {
      if (this.avgProft.long && this.avgProft.short) {
        this.avgProft.all = (this.avgProft.long + this.avgProft.short) / (count.trades.all ?? 1);
        this.avgProft.long = this.avgProft.long / (count.trades.long || 1);
        this.avgProft.short = this.avgProft.short / (count.trades.short || 1);
      }

      if (this.avgLoss.long && this.avgLoss.short) {
        this.avgLoss.all = (this.avgLoss.long + this.avgLoss.short) / (count.trades.all ?? 1);
        this.avgLoss.long = this.avgLoss.long / (count.trades.long || 1);
        this.avgLoss.short = this.avgLoss.short / (count.trades.short || 1);
      }

      if (this.finalProft) {
        this.returnPercentage = this.finalProft / this.accountSize;
      }

      return;
    }

    this.finalProft = this.finalProft + trade.profit;

    if (trade.result === 'win' && trade.profit >= 0) {
      this.avgProft[trade.direction] = (this.avgProft[trade.direction] ?? 0) + trade.profit;
    } else if (trade.result === 'loss') {
      this.avgLoss[trade.direction] = (this.avgLoss[trade.direction] ?? 0) + trade.profit;
    }
  }
}

export default PerformanceStatistic;
