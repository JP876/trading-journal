import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Trade } from '../trade.schema';
import { AccountsService } from 'src/accounts/providers/accounts.service';
import { User } from 'src/user/user.schema';
import { tradeResult } from '../enums';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Trade.name) private readonly tradeModel: Model<Trade>,
    private readonly accountsService: AccountsService
  ) {}

  public async getStatistics(user: User) {
    const accounts = await this.accountsService.findMainAccount(user);
    if (!Array.isArray(accounts)) throw new NotFoundException();

    const pairTrades: { _id: string; count: number }[] = await this.tradeModel.aggregate([
      { $match: { account: accounts[0]?._id } },
      { $group: { _id: '$pair', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const findByResults: { _id: tradeResult; count: number }[] = await this.tradeModel.aggregate([
      { $match: { account: accounts[0]?._id } },
      { $group: { _id: '$result', count: { $sum: 1 } } },
    ]);

    const mostProfitablePairs: { _id: number; pairs: { pair: string; count: number }[] }[] =
      await this.tradeModel.aggregate([
        { $match: { account: accounts[0]?._id, result: 'win' } },
        { $group: { _id: { pair: '$pair' }, count: { $sum: 1 } } },
        { $group: { _id: '$count', pairs: { $push: { pair: '$_id.pair', count: '$count' } } } },
        { $sort: { _id: -1 } },
        { $limit: 1 },
      ]);

    return { mostProfitablePairs: mostProfitablePairs[0].pairs, findByResults, pairTrades };
  }
}
