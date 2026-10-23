import type { Trade } from '../../../../types/trade';
import type { Statistic, TStatistic } from '../types';

class CountTradesStatistic implements Statistic {
  trades: TStatistic = { all: null, long: null, short: null };
  loss: TStatistic = { all: null, long: null, short: null };
  win: TStatistic = { all: null, long: null, short: null };

  constructor() {}

  update(trade: Trade | null): void {
    if (!trade) {
      this.trades.all = (this.trades.long ?? 0) + (this.trades.short ?? 0);
      return;
    }

    this.trades[trade.direction] = (this.trades[trade.direction] ?? 0) + 1;

    if (trade.result === 'win') {
      this.win.all = (this.win.all ?? 0) + 1;
      this.win[trade.direction] = (this.win[trade.direction] ?? 0) + 1;
    } else if (trade.result === 'loss') {
      this.loss.all = (this.loss.all ?? 0) + 1;
      this.loss[trade.direction] = (this.loss[trade.direction] ?? 0) + 1;
    }
  }
}

export default CountTradesStatistic;
