import { Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { Trade } from '../trade.entity';
import { CreateTradeDto } from '../dtos/create-trade.dto';
import { PairsService } from 'src/pairs/providers/pairs.service';
import { TradingSessionsService } from 'src/trading-sessions/providers/trading-sessions.service';
import withCatch from 'src/utils/withCatch';
import { UpdateTradeDto } from '../dtos/update-trade.dto';

@Injectable()
export class TradesService {
  constructor(
    @InjectRepository(Trade)
    private readonly tradesRepository: Repository<Trade>,
    private readonly pairsService: PairsService,
    private readonly tradingSessionsService: TradingSessionsService
  ) {}

  private async saveTrade(trade: Trade) {
    const [err, saved] = await withCatch(this.tradesRepository.save(trade));
    if (err) {
      throw new RequestTimeoutException('Unable to proccess your request at the moment. Please try later', {
        description: err.message,
      });
    }
    return saved;
  }

  public async findAll() {
    const [err, trades] = await withCatch(this.tradesRepository.find());
    if (err) {
      throw new RequestTimeoutException('Unable to proccess your request at the moment. Please try later', {
        description: err.message,
      });
    }
    return trades;
  }

  public async findOneBy(options: FindOptionsWhere<Trade>) {
    const [err, trade] = await withCatch(this.tradesRepository.findOneBy(options));

    if (err) {
      throw new RequestTimeoutException('Unable to proccess your request at the moment. Please try later', {
        description: err.message,
        cause: err.cause,
      });
    }
    if (!trade) {
      throw new NotFoundException(`The trade with options: ${JSON.stringify(options)} does not exist.`);
    }

    return trade;
  }

  public async create(createTradeDto: CreateTradeDto) {
    const [pair, session] = await Promise.all([
      this.pairsService.findOneBy({ id: createTradeDto.pairId }),
      this.tradingSessionsService.findOneBy({ id: createTradeDto.tradingSessionId }),
    ]);

    const trade = this.tradesRepository.create({ ...createTradeDto, pair, tradingSession: session });
    return this.saveTrade(trade);
  }

  public async update(id: number, updateTradeDto: UpdateTradeDto) {
    const trade = await this.findOneBy({ id });

    trade.openDate = updateTradeDto.openDate ?? trade.openDate;
    trade.closeDate = updateTradeDto.closeDate ?? trade.closeDate;
    trade.stopLoss = updateTradeDto.stopLoss ?? trade.stopLoss;
    trade.takeProfit = updateTradeDto.takeProfit ?? trade.takeProfit;
    trade.result = updateTradeDto.result ?? trade.result;
    trade.direction = updateTradeDto.direction ?? trade.direction;

    if (updateTradeDto.pairId) {
      trade.pair = await this.pairsService.findOneBy({ id: updateTradeDto.pairId });
    }
    if (updateTradeDto.tradingSessionId) {
      trade.tradingSession = await this.tradingSessionsService.findOneBy({ id: updateTradeDto.tradingSessionId });
    }

    return this.saveTrade(trade);
  }

  public async delete(id: number) {
    await this.findOneBy({ id });
    const [err] = await withCatch(this.tradesRepository.delete(id));

    if (err) {
      throw new RequestTimeoutException('Unable to process your request at the moment please try later');
    }
    return { id, message: 'Success' };
  }
}
