import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Pair } from '../pair.entitiy';
import withCatch from 'src/utils/withCatch';

@Injectable()
export class PairsService {
  constructor(
    @InjectRepository(Pair)
    private readonly pairsRepository: Repository<Pair>
  ) {}

  public async getAll() {
    const [err, pairs] = await withCatch(this.pairsRepository.find());
    if (err) {
      throw new RequestTimeoutException('Unable to proccess your request at the moment. Please try later', {
        description: err.message,
      });
    }
    return pairs;
  }
}
