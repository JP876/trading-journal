import type { Trade } from "../../../../types/trade";
import type { Statistic, TStatistic } from "../types";
import type CountTradesStatistic from "./CountTrades";

class PerformanceStatistic implements Statistic {
  finalProft: number = 0;
  returnPercentage: number = 0;
  avgProft: TStatistic = { all: null, long: null, short: null };
  avgLoss: TStatistic = { all: null, long: null, short: null };
  avgRR: TStatistic = { all: null, long: null, short: null };
  // TODO: take in account position size and pip value
  private totalTP: TStatistic = { all: null, long: null, short: null };
  private totalSL: TStatistic = { all: null, long: null, short: null };

  maxDrawdown: number = 0;
  maxDrawdonwPercentage: number = 0;
  peakEquity: number = 0;

  private accountSize: number = 0;

  constructor(accountSize: number) {
    this.accountSize = accountSize;
  }

  update(trade: Trade | null, count: CountTradesStatistic): void {
    if (!trade || typeof trade.profit !== "number") {
      if (this.avgProft.long && this.avgProft.short) {
        this.avgProft.all = (this.avgProft.long + this.avgProft.short) / (count.win.all ?? 1);
        this.avgProft.long = this.avgProft.long / (count.win.long || 1);
        this.avgProft.short = this.avgProft.short / (count.win.short || 1);
      }

      if (this.totalSL.long && this.totalSL.short && this.totalTP.long && this.totalTP.short) {
        this.totalSL.all = this.totalSL.long + this.totalSL.short;
        this.totalTP.all = this.totalTP.long + this.totalTP.short;
        this.avgRR.all = this.totalTP.all / this.totalSL.all;
        this.avgRR.long = this.totalTP.long / this.totalSL.long;
        this.avgRR.short = this.totalTP.short / this.totalSL.short;
      }

      if (this.avgLoss.long && this.avgLoss.short) {
        this.avgLoss.all = (this.avgLoss.long + this.avgLoss.short) / (count.loss.all ?? 1);
        this.avgLoss.long = this.avgLoss.long / (count.loss.long || 1);
        this.avgLoss.short = this.avgLoss.short / (count.loss.short || 1);
      }

      if (this.finalProft) {
        this.returnPercentage = this.finalProft / this.accountSize;
      }

      if (this.maxDrawdown && this.peakEquity) {
        this.maxDrawdonwPercentage = (this.maxDrawdown / this.peakEquity) * 100;
      }

      return;
    }

    this.finalProft = this.finalProft + trade.profit;

    this.peakEquity = Math.max(this.peakEquity, this.finalProft);
    let currentDrawdown = this.peakEquity - this.finalProft;
    this.maxDrawdown = Math.max(currentDrawdown, this.maxDrawdown);

    let tp = trade.closedAt || trade.takeProfit;
    if (trade.stopLoss && tp) {
      this.totalSL[trade.direction] = (this.totalSL[trade.direction] ?? 0) + trade.stopLoss;
      this.totalTP[trade.direction] = (this.totalTP[trade.direction] ?? 0) + tp;
    }

    if (trade.result === "win" && trade.profit >= 0) {
      this.avgProft[trade.direction] = (this.avgProft[trade.direction] ?? 0) + trade.profit;
    } else if (trade.result === "loss") {
      this.avgLoss[trade.direction] = (this.avgLoss[trade.direction] ?? 0) + trade.profit;
    }
  }
}

export default PerformanceStatistic;
