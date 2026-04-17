import { Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, In, Raw, Repository } from 'typeorm';

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
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provder';
import { DirectionOptions, ResultOptions } from '../enums';
import { TagsService } from 'src/tags/providers/tags.service';
import { Tag } from 'src/tags/tag.entity';

type CountsResultType = {
  direction: DirectionOptions | null;
  pairId: number | null;
  result: ResultOptions | null;
  count: number;
};

@Injectable()
export class TradesService {
  constructor(
    @InjectRepository(Trade)
    private readonly tradesRepository: Repository<Trade>,
    private readonly pairsService: PairsService,
    private readonly tradingSessionsService: TradingSessionsService,
    private readonly paginationProvider: PaginationProvider,
    private readonly dataSource: DataSource,
    private readonly tagsService: TagsService
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

  public async findStats() {
    const countsQuery: Promise<CountsResultType[]> = this.dataSource.query(`
      SELECT direction, NULL as pairId, NULL as result, COUNT(*) as count
      FROM trades
      GROUP BY direction

      UNION ALL

      SELECT NULL as direction, pairId, NULL as result, COUNT(*) as count
      FROM trades
      GROUP BY pairId

      UNION ALL

      SELECT NULL as direction, NULL as pairId, result, COUNT(*) as count
      FROM trades
      GROUP BY result
    `);

    const [error, result] = await withCatch(Promise.all([countsQuery]));
    if (error) {
      throw new RequestTimeoutException('Unable to proccess your request at the moment. Please try later', {
        description: error.message,
      });
    }

    const [counts] = result;

    const directionCounts = {};
    const pairCounts = {};
    const resultCounts = {};

    for (const row of counts) {
      if (row.direction !== null) {
        directionCounts[row.direction] = Number(row.count);
      }
      if (row.pairId !== null) {
        pairCounts[row.pairId] = Number(row.count);
      }
      if (row.result !== null) {
        resultCounts[row.result] = Number(row.count);
      }
    }

    return {
      direction: directionCounts,
      pairs: pairCounts,
      result: resultCounts,
    };
  }

  public async findTradesCount() {
    const countsQuery: Promise<{ tradingSession: number; count: number }[]> = this.tradesRepository
      .createQueryBuilder('t')
      .select('t.tradingSession', 'tradingSession')
      .addSelect('COUNT(*)', 'count')
      .groupBy('t.tradingSession')
      .getRawMany();
    const [error, result] = await withCatch(countsQuery);

    if (error) {
      throw new RequestTimeoutException('Unable to proccess your request at the moment. Please try later', {
        description: error.message,
        cause: error.cause,
      });
    }
    return result;
  }

  public async findAll(tradesQuery: GetTradesDto): Promise<Paginated<Trade[]>> {
    const { tradingSessionId, pairId, result, direction, openDate, closeDate, tags } = tradesQuery;
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

    const data = await this.paginationProvider.paginateQuery(
      this.tradesRepository,
      tradesQuery,
      {
        loadRelationIds: { relations: ['tags', 'pair', 'tradingSession'] },
        order: { id: -1 },
        where: {
          tradingSession: session,
          result,
          direction,
          ...(openDate ? { openDate: Raw((alias) => `${alias} > :date`, { date: openDate }) } : {}),
          ...(closeDate ? { closeDate: Raw((alias) => `${alias} < :date`, { date: closeDate }) } : {}),
          ...(pair ? { pair: pair } : {}),
          ...(tags ? { tags: { id: In(tags?.split(',')) } } : {}),
        },
      },
      { where: { tradingSession: session } }
    );

    return { ...data };
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
    let tags: Tag[] = [];
    const [pair, session] = await Promise.all([
      this.pairsService.findOneBy({ id: createTradeDto.pairId }),
      this.tradingSessionsService.findOneBy({ id: createTradeDto.tradingSessionId }),
    ]);

    if (Array.isArray(createTradeDto.tags) && createTradeDto.tags.length > 0) {
      tags = await this.tagsService.findMultipleTags(createTradeDto.tags);
    }

    const trade = this.tradesRepository.create({ ...createTradeDto, pair, tradingSession: session, tags });
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
    if (Array.isArray(updateTradeDto.tags) && updateTradeDto.tags.length > 0) {
      trade.tags = await this.tagsService.findMultipleTags(updateTradeDto.tags);
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
