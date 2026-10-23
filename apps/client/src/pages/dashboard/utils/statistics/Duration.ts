import { differenceInSeconds } from 'date-fns';

import type { Trade } from '../../../../types/trade';
import type { Statistic, TStatistic } from '../types';

class DurationStatistics implements Statistic {
  shortestWon: TStatistic = { all: null, long: null, short: null };
  longestWon: TStatistic = { all: null, long: null, short: null };
  shortestLost: TStatistic = { all: null, long: null, short: null };
  longestLost: TStatistic = { all: null, long: null, short: null };

  private duration: number = 0;

  constructor() {}

  private updateTradeDuration(prev: number | null, next: number | null, checkLongset?: boolean) {
    if (!next && !prev) return null;
    if (!next) return prev;
    if (!prev) return next;
    if (checkLongset) {
      return prev < next ? next : prev;
    } else {
      return prev > next ? next : prev;
    }
  }

  update(trade: Trade | null): void {
    if (!trade || !trade.openDate || !trade.closeDate) {
      this.shortestLost.all = this.updateTradeDuration(this.shortestLost.long, this.shortestLost.short);
      this.shortestWon.all = this.updateTradeDuration(this.shortestWon.long, this.shortestWon.short);
      this.longestLost.all = this.updateTradeDuration(this.longestLost.long, this.longestLost.short, true);
      this.longestWon.all = this.updateTradeDuration(this.longestWon.long, this.longestWon.short, true);

      return;
    }

    this.duration = differenceInSeconds(trade.closeDate, trade.openDate);

    if (trade.result === 'win') {
      this.shortestWon[trade.direction] = this.updateTradeDuration(this.shortestWon[trade.direction], this.duration);
      this.longestWon[trade.direction] = this.updateTradeDuration(
        this.longestWon[trade.direction],
        this.duration,
        true
      );
    } else if (trade.result === 'loss') {
      this.shortestLost[trade.direction] = this.updateTradeDuration(this.shortestLost[trade.direction], this.duration);
      this.longestLost[trade.direction] = this.updateTradeDuration(
        this.longestLost[trade.direction],
        this.duration,
        true
      );
    }
  }
}

export default DurationStatistics;
