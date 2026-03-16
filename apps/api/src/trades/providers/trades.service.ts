import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Trade } from '../trade.entity';
import { CreateTradeDto } from '../dtos/create-trade.dto';

@Injectable()
export class TradesService {
  constructor(
    @InjectRepository(Trade)
    private readonly tradesRepository: Repository<Trade>
  ) {}

  public getAll() {
    return this.tradesRepository.find();
  }

  public async create(createTradeDto: CreateTradeDto) {
    const trade = this.tradesRepository.create({ ...createTradeDto });
    return await this.tradesRepository.save(trade);
  }
}
