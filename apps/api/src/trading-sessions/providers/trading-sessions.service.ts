import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TradingSession } from '../trading-session.entity';
import withCatch from 'src/utils/withCatch';
import { User } from 'src/users/user.entity';
import { CreateTradingSession } from '../dtos/create-trading-session.dto';

@Injectable()
export class TradingSessionsService {
  constructor(
    @InjectRepository(TradingSession)
    private readonly tradingSessionsRepository: Repository<TradingSession>
  ) {}

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
}
