import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Trade } from '../trade.schema';
import { tradeDirection, tradeResult } from '../enums';

type numOfTradesPerDate = {
  _id: string;
  count: number;
  list: {
    id: string;
    result: tradeResult;
    pair: string;
    direction: tradeDirection;
    closeDate: string;
    openDate: string;
    takeProfit: number;
    stopLoss: number;
  }[];
};

type groupedByResult = { _id: tradeResult; count: number };
type groupedByPair = { pair: string; results: { result: tradeResult; count: number }[] };
type mostProfitablePair = { _id: number; pairs: { pair: string; count: number }[] };
type consecutiveResults = { _id: null; count: number; result: tradeResult };
type generalInfoType = { _id?: null; avgTakeProfit: number; avgStopLoss: number; avgTradeDuration: number };
type winRateByDirectionType = { _id: tradeDirection; win: number; loss: number; be: number };
type tradesPerWeekType = { avgTradesPerWeek: number };

@Injectable()
export class StatsService {
  constructor(@InjectModel(Trade.name) private readonly tradeModel: Model<Trade>) {}

  public async getNumOfTradesPerDay(id: Types.ObjectId) {
    const numOfTradesPerDate: numOfTradesPerDate[] = await this.tradeModel.aggregate([
      { $match: { account: id } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$closeDate' } },
          count: { $sum: 1 },
          list: {
            $push: {
              id: '$_id',
              result: '$result',
              pair: '$pair',
              direction: '$direction',
              closeDate: '$closeDate',
              openDate: '$openDate',
              takeProfit: '$takeProfit',
              stopLoss: '$stopLoss',
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return numOfTradesPerDate;
  }

  public async groupTradesByResults(id: Types.ObjectId) {
    const groupByResults: groupedByResult[] = await this.tradeModel.aggregate([
      { $match: { account: id } },
      { $group: { _id: '$result', count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]);
    return groupByResults;
  }

  public async groupTradesByPairs(id: Types.ObjectId) {
    const pairTrades: groupedByPair[] = await this.tradeModel.aggregate([
      { $match: { account: id } },
      {
        $group: {
          _id: { pair: '$pair', result: '$result' },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.pair',
          results: {
            $push: { result: '$_id.result', count: '$count' },
          },
        },
      },
      { $project: { _id: 0, pair: '$_id', results: 1 } },
      { $sort: { pair: 1 } },
    ]);
    return pairTrades;
  }

  public async findMostProfitablePairs(id: Types.ObjectId) {
    const mostProfitablePairs: mostProfitablePair[] = await this.tradeModel.aggregate([
      { $match: { account: id, result: 'win' } },
      { $group: { _id: { pair: '$pair' }, count: { $sum: 1 } } },
      { $group: { _id: '$count', pairs: { $push: { pair: '$_id.pair', count: '$count' } } } },
      { $sort: { _id: -1 } },
    ]);
    return mostProfitablePairs;
  }

  public async findGeneralInfo(id: Types.ObjectId) {
    const generalInfo: generalInfoType[] = await this.tradeModel.aggregate([
      {
        $match: {
          account: id,
          takeProfit: { $exists: true },
          stopLoss: { $exists: true },
          openDate: { $exists: true },
          closeDate: { $exists: true },
        },
      },
      {
        $project: {
          takeProfit: 1,
          stopLoss: 1,
          tradeDuration: {
            $subtract: ['$closeDate', '$openDate'],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgTakeProfit: { $avg: '$takeProfit' },
          avgStopLoss: { $avg: '$stopLoss' },
          avgTradeDuration: { $avg: '$tradeDuration' },
        },
      },
    ]);

    return generalInfo?.[0];
  }

  public async findMostConsecutiveResults(id: Types.ObjectId, result: tradeResult) {
    const mostConsecutiveResults: consecutiveResults[] = await this.tradeModel.aggregate([
      { $match: { account: id } },
      { $group: { _id: null, results: { $push: '$result' } } },
      {
        $project: {
          consecutiveResults: {
            $reduce: {
              input: { $ifNull: ['$results', []] },
              initialValue: { count: 0, max: 0 },
              in: {
                $cond: [
                  { $eq: ['$$this', result] },
                  {
                    $let: {
                      vars: { newCount: { $add: ['$$value.count', 1] } },
                      in: {
                        count: '$$newCount',
                        max: {
                          $cond: [{ $gt: ['$$newCount', '$$value.max'] }, '$$newCount', '$$value.max'],
                        },
                      },
                    },
                  },
                  { count: 0, max: '$$value.max' },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          count: '$consecutiveResults.max',
          result: result,
        },
      },
    ]);
    return mostConsecutiveResults[0];
  }

  public async findWinRateByDirection(id: Types.ObjectId) {
    const stats: winRateByDirectionType[] = await this.tradeModel.aggregate([
      { $match: { account: id } },
      {
        $group: {
          _id: '$direction',
          win: {
            $sum: {
              $cond: [{ $eq: ['$result', 'win'] }, 1, 0],
            },
          },
          loss: {
            $sum: {
              $cond: [{ $eq: ['$result', 'loss'] }, 1, 0],
            },
          },
          be: {
            $sum: {
              $cond: [{ $eq: ['$result', 'be'] }, 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    return stats;
  }

  public async findAverageNumberOfTradesPerWeek(id: Types.ObjectId) {
    const stats: tradesPerWeekType[] = await this.tradeModel.aggregate([
      { $match: { account: id } },
      {
        $group: {
          _id: { $dateTrunc: { date: '$closeDate', unit: 'week' } },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          avgTradesPerWeek: { $avg: '$count' },
        },
      },
      {
        $project: {
          _id: 0,
          avgTradesPerWeek: 1,
        },
      },
    ]);
    return stats?.[0];
  }
}
