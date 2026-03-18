import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Trade } from '../trade.entity';
import { CreateTradeDto } from '../dtos/create-trade.dto';
import { PairsService } from 'src/pairs/providers/pairs.service';
import { TradingSessionsService } from 'src/trading-sessions/providers/trading-sessions.service';
import withCatch from 'src/utils/withCatch';

@Injectable()
export class TradesService {
  constructor(
    @InjectRepository(Trade)
    private readonly tradesRepository: Repository<Trade>,
    private readonly pairsService: PairsService,
    private readonly tradingSessionsService: TradingSessionsService
  ) {}

  public async getAll() {
    const [err, trades] = await withCatch(this.tradesRepository.find());
    if (err) {
      throw new RequestTimeoutException('Unable to proccess your request at the moment. Please try later', {
        description: err.message,
      });
    }
    return trades;
  }

  public async create(createTradeDto: CreateTradeDto) {
    const [pair, session] = await Promise.all([
      this.pairsService.findOneBy({ id: createTradeDto.pairId }),
      this.tradingSessionsService.findOneBy({ id: createTradeDto.tradingSessionId }),
    ]);

    const trade = this.tradesRepository.create({ ...createTradeDto, pair, tradingSession: session });
    const [err, saved] = await withCatch(this.tradesRepository.save(trade));

    if (err) {
      throw new RequestTimeoutException('Unable to proccess your request at the moment. Please try later', {
        description: err.message,
      });
    }
    return saved;
  }

  public async delete(id: number) {
    const [err] = await withCatch(this.tradesRepository.delete(id));
    if (err) {
      throw new RequestTimeoutException('Unable to process your request at the moment please try later');
    }
    return { id, message: 'Success' };
  }
}
