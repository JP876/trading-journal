import { Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { join } from 'path';
import * as csv from 'csv-parser';
import * as fs from 'fs';

import { Pair } from '../pair.entitiy';
import withCatch from 'src/utils/withCatch';

type PairType = {
  pair: string;
  assetClass: string;
  baseIso: string;
  baseName: string;
  baseCountry: string;
  quoteIso: string;
  quoteName: string;
  quoteCountry: string;
};

@Injectable()
export class PairsService {
  constructor(
    @InjectRepository(Pair)
    private readonly pairsRepository: Repository<Pair>
  ) {}

  public async findOneBy(options: FindOptionsWhere<Pair>): Promise<Pair> {
    const [findError, pair] = await withCatch(this.pairsRepository.findOneBy(options));

    if (findError) {
      throw new RequestTimeoutException('Unable to proccess your request at the moment. Please try later', {
        description: findError.message,
      });
    }
    if (!pair) {
      throw new NotFoundException(`Pair does not exist`);
    }

    return pair;
  }

  public async getAll() {
    const [err, pairs] = await withCatch(this.pairsRepository.find());

    if (err) {
      throw new RequestTimeoutException('Unable to proccess your request at the moment. Please try later', {
        description: err.message,
      });
    }

    if (pairs.length > 0) return pairs;

    const results: Pair[] = [];
    const readFile = new Promise((resolve, reject) => {
      fs.createReadStream(join(__dirname, '../../../', 'pairs.csv'))
        .pipe(csv({ separator: ',' }))
        .on('data', (data: PairType) => {
          results.push(this.pairsRepository.create({ ...data }));
        })
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });

    const [readError] = await withCatch(readFile);

    if (readError) {
      throw new RequestTimeoutException('Unable to proccess your request at the moment. Please try later', {
        description: readError.message,
      });
    }

    const [insertError] = await withCatch(this.pairsRepository.insert(results));

    if (insertError) {
      throw new RequestTimeoutException('Unable to proccess your request at the moment. Please try later', {
        description: insertError.message,
      });
    }

    return results;
  }
}
