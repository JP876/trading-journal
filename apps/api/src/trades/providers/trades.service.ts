import { Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Raw, Repository } from 'typeorm';

import { Trade } from '../trade.entity';
import { CreateTradeDto } from '../dtos/create-trade.dto';
import { PairsService } from 'src/pairs/providers/pairs.service';
import { TradingSessionsService } from 'src/trading-sessions/providers/trading-sessions.service';
import withCatch from 'src/utils/withCatch';
import { UpdateTradeDto } from '../dtos/update-trade.dto';
import { GetTradesDto } from '../dtos/get-trades.dto';
import { Paginated } from 'src/common/pagination/types';
import { TradingSession } from 'src/trading-sessions/trading-session.entity';
import { Pair } from 'src/pairs/pair.entitiy';

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

  public async findAll(tradesQuery: GetTradesDto): Promise<Paginated<Trade[]>> {
    const { limit, page, tradingSessionId, pairId, result, direction, openDate, closeDate } = tradesQuery;
    let session: TradingSession | null = null;
    let pair: Pair | null = null;

    if (tradingSessionId) {
      session = await this.tradingSessionsService.findOneBy({ id: tradingSessionId });
    } else {
      session = await this.tradingSessionsService.findOneBy({ isMain: 1 });
    }

    if (pairId) {
      pair = await this.pairsService.findOneBy({ id: pairId });
    }

    const [err, trades] = await withCatch(
      this.tradesRepository.find({
        take: limit,
        skip: (page - 1) * limit,
        where: {
          tradingSession: session,
          result,
          direction,
          ...(openDate ? { openDate: Raw((alias) => `${alias} > :date`, { date: openDate }) } : {}),
          ...(closeDate ? { closeDate: Raw((alias) => `${alias} > :date`, { date: closeDate }) } : {}),
          ...(pair ? { pair: pair } : {}),
        },
      })
    );

    if (err) {
      throw new RequestTimeoutException('Unable to proccess your request at the moment. Please try later', {
        description: err.message,
      });
    }

    const totalItems = await this.tradesRepository.count();
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, totalPages, itemsPerPage: limit, currentPage: page, results: trades };
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
