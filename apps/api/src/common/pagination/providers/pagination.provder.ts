import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { FindManyOptions, ObjectLiteral, Repository } from 'typeorm';

import { PaginationDto } from '../dtos/pagination.dto';
import withCatch from 'src/utils/withCatch';
import { Paginated } from '../types';

@Injectable()
export class PaginationProvider {
  constructor() {}

  public async paginateQuery<T extends ObjectLiteral>(
    repository: Repository<T>,
    query?: PaginationDto,
    options?: FindManyOptions<T>
  ) {
    const [error, resultsAndCount] = await withCatch(
      Promise.all([
        repository.findAndCount({
          take: query?.limit,
          skip: query?.limit ? ((query?.page || 1) - 1) * query?.limit : undefined,
          ...options,
        }),
        repository.count(),
      ])
    );

    if (error) {
      throw new RequestTimeoutException('Unable to process your request at the moment please try later', {
        description: error.message,
      });
    }

    const [[results, count], totalCount] = resultsAndCount;

    const finalData: Paginated<T[]> = {
      results: results,
      totalItems: count,
      totalItemsExcludingQuery: totalCount,
    };

    if (query?.limit) {
      finalData.totalPages = Math.ceil(count / query?.limit);
      finalData.itemsPerPage = query.limit;
      finalData.currentPage = query?.page || 1;
    }

    return finalData;
  }
}
