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

  public async getStatistics(user: User) {
    const accounts = await this.accountsService.findMainAccount(user);
    if (!Array.isArray(accounts)) throw new NotFoundException();

    const pairTrades: { _id: string; count: number }[] = await this.tradeModel.aggregate([
      { $match: { account: accounts[0]?._id } },
      { $group: { _id: '$pair', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const mostProfitablePairs: { _id: number; pairs: { pair: string; count: number }[] }[] =
      await this.tradeModel.aggregate([
        { $match: { account: accounts[0]?._id, result: 'win' } },
        { $group: { _id: { pair: '$pair' }, count: { $sum: 1 } } },
        { $group: { _id: '$count', pairs: { $push: { pair: '$_id.pair', count: '$count' } } } },
        { $sort: { _id: -1 } },
        { $limit: 1 },
      ]);

    return;
  }
}
