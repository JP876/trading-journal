import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Trade } from '../trade.schema';
import { AccountsService } from 'src/accounts/providers/accounts.service';
import { User } from 'src/user/user.schema';
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
  }[];
};

type groupedByResult = { _id: tradeResult; count: number };
type groupedByPair = { pair: string; results: { result: tradeResult; count: number }[] };
type mostProfitablePair = { _id: number; pairs: { pair: string; count: number }[] };
type consecutiveResults = { _id: null; count: number; result: tradeResult };
type generalInfoType = { _id?: null; avgTakeProfit: number; avgStopLoss: number; avgTradeDuration: number };

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Trade.name) private readonly tradeModel: Model<Trade>,
    private readonly accountsService: AccountsService
  ) {}

  private async getMainAccount(user: User) {
    const accounts = await this.accountsService.findMainAccount(user);
    if (!Array.isArray(accounts)) throw new NotFoundException();
    return accounts[0];
  }

  public async getNumOfTradesPerDay(user: User) {
    const account = await this.getMainAccount(user);

    const numOfTradesPerDate: numOfTradesPerDate[] = await this.tradeModel.aggregate([
      { $match: { account: account._id } },
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
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    return numOfTradesPerDate;
  }

  public async groupTradesByResults(user: User) {
    const account = await this.getMainAccount(user);
    const groupByResults: groupedByResult[] = await this.tradeModel.aggregate([
      { $match: { account: account._id } },
      { $group: { _id: '$result', count: { $sum: 1 } } },
    ]);
    return groupByResults;
  }

  public async groupTradesByPairs(user: User) {
    const account = await this.getMainAccount(user);
    const pairTrades: groupedByPair[] = await this.tradeModel.aggregate([
      { $match: { account: account._id } },
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
    ]);
    return pairTrades;
  }

  public async findMostProfitablePairs(user: User) {
    const account = await this.getMainAccount(user);
    const mostProfitablePairs: mostProfitablePair[] = await this.tradeModel.aggregate([
      { $match: { account: account._id, result: 'win' } },
      { $group: { _id: { pair: '$pair' }, count: { $sum: 1 } } },
      { $group: { _id: '$count', pairs: { $push: { pair: '$_id.pair', count: '$count' } } } },
      { $sort: { _id: -1 } },
    ]);
    return mostProfitablePairs;
  }

  public async findGeneralInfo(user: User) {
    const account = await this.getMainAccount(user);
    const generalInfo: generalInfoType[] = await this.tradeModel.aggregate([
      {
        $match: {
          account: account._id,
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
    return generalInfo[0];
  }

  public async findMostConsecutiveResults(user: User, result: tradeResult) {
    const account = await this.getMainAccount(user);
    const mostConsecutiveResults: consecutiveResults[] = await this.tradeModel.aggregate([
      { $match: { account: account._id } },
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
}
