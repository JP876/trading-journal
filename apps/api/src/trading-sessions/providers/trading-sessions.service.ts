import { Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { TradingSession } from '../trading-session.entity';
import withCatch from 'src/utils/withCatch';
import { User } from 'src/users/user.entity';
import { CreateTradingSession } from '../dtos/create-trading-session.dto';
import { UpdateTradingSession } from '../dtos/update-trading-session.dto';

@Injectable()
export class TradingSessionsService {
  constructor(
    @InjectRepository(TradingSession)
    private readonly tradingSessionsRepository: Repository<TradingSession>
  ) {}

  public async findOneBy(options: FindOptionsWhere<TradingSession>): Promise<TradingSession> {
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

  public async findAll(user: User) {
    const [error, sessions] = await withCatch(this.tradingSessionsRepository.find({ where: { user } }));
    if (error) {
      throw new RequestTimeoutException('Unable to process your request at the moment please try later', {
        description: error.message,
      });
    }
    return Array.isArray(sessions) ? sessions : [];
  }

  public async create(user: User, session: CreateTradingSession) {
    const newSession = this.tradingSessionsRepository.create({ ...session, user });
    const [saveError, created] = await withCatch(this.tradingSessionsRepository.save(newSession));

    if (saveError) {
      throw new RequestTimeoutException('Unable to proccess your request at the moment. Please try later', {
        description: saveError.message,
      });
    }

    return created;
  }

  public async update(id: number, session: UpdateTradingSession) {
    const [findError, existingSession] = await withCatch(this.tradingSessionsRepository.findOneBy({ id }));

    if (findError) {
      throw new RequestTimeoutException('Unable to process your request at the moment please try later');
    }
    if (!existingSession) {
      throw new NotFoundException(`The trading session with ID: ${id} does not exist.`);
    }

    existingSession.title = session.title ?? existingSession.title;
    existingSession.description = session.description ?? existingSession.description;
    existingSession.isMain = session.isMain ?? existingSession.isMain;

    const [saveError, savedSession] = await withCatch(this.tradingSessionsRepository.save(existingSession));
    if (saveError) {
      throw new RequestTimeoutException('Unable to process your request at the moment please try later');
    }
    return savedSession;
  }

  public async delete(id: number) {
    const [err] = await withCatch(this.tradingSessionsRepository.delete(id));
    if (err) {
      throw new RequestTimeoutException('Unable to process your request at the moment please try later');
    }
    return { id, message: 'Success' };
  }
}
