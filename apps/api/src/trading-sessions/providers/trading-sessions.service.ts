import { Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Raw, Repository } from 'typeorm';

import { TradingSession } from '../trading-session.entity';
import withCatch from 'src/utils/withCatch';
import { User } from 'src/users/user.entity';
import { CreateTradingSessionDto } from '../dtos/create-trading-session.dto';
import { UpdateTradingSessionDto } from '../dtos/update-trading-session.dto';
import { GetTradingSessionsDto } from '../dtos/get-trading-sessions.dto';
import { Paginated } from 'src/common/pagination/types';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provder';

@Injectable()
export class TradingSessionsService {
  constructor(
    @InjectRepository(TradingSession)
    private readonly tradingSessionsRepository: Repository<TradingSession>,
    private readonly paginationProvider: PaginationProvider
  ) {}

  private async updateMainSession() {
    const [err, mainSessions] = await withCatch(this.tradingSessionsRepository.findBy({ isMain: 1 }));
    if (err) {
      throw new RequestTimeoutException('Unable to process your request at the moment please try later');
    }
    await this.tradingSessionsRepository.save(mainSessions.map((s) => ({ ...s, isMain: 0 })));
  }

  public async findOneBy(options: FindOptionsWhere<TradingSession>) {
    const [findError, session] = await withCatch(this.tradingSessionsRepository.findOneBy(options));

    if (findError) {
      throw new RequestTimeoutException('Unable to proccess your request at the moment. Please try later', {
        description: findError.message,
      });
    }
    if (!session) {
      throw new NotFoundException(`Trading session does not exist`);
    }

    return session;
  }

  public async findAll(user: User, query?: GetTradingSessionsDto): Promise<Paginated<TradingSession[]>> {
    const data = await this.paginationProvider.paginateQuery(this.tradingSessionsRepository, query, {
      order: { id: -1 },
      where: {
        user,
        ...(query?.title ? { title: Raw((alias) => `${alias} LIKE :title`, { title: `%${query?.title}%` }) } : {}),
      },
      relations: ['trades'],
    });

    const results = data.results.map((session) => {
      const copy = { ...session };
      delete copy.trades;
      return { ...copy, tradesCount: session.trades?.length };
    });

    return { ...data, results };
  }

  public async create(user: User, session: CreateTradingSessionDto) {
    if (session.isMain) {
      await this.updateMainSession();
    }

    const newSession = this.tradingSessionsRepository.create({ ...session, user });
    const [saveError, created] = await withCatch(this.tradingSessionsRepository.save(newSession));

    if (saveError) {
      throw new RequestTimeoutException('Unable to proccess your request at the moment. Please try later', {
        description: saveError.message,
      });
    }

    return created;
  }

  public async update(id: number, updateSession: UpdateTradingSessionDto) {
    const session = await this.findOneBy({ id });

    session.title = updateSession.title ?? session.title;
    session.description = updateSession.description ?? session.description;
    session.isMain = updateSession.isMain ?? session.isMain;

    if (updateSession.isMain) {
      await this.updateMainSession();
    }

    const [saveError, savedSession] = await withCatch(this.tradingSessionsRepository.save(session));
    if (saveError) {
      throw new RequestTimeoutException('Unable to process your request at the moment please try later');
    }
    return savedSession;
  }

  public async delete(id: number) {
    await this.findOneBy({ id });
    const [err] = await withCatch(this.tradingSessionsRepository.delete(id));

    if (err) {
      throw new RequestTimeoutException('Unable to process your request at the moment please try later');
    }

    return { id, message: 'Success' };
  }
}
