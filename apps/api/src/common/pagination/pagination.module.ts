import { Module } from '@nestjs/common';

import { PaginationProvider } from './providers/pagination.provder';

@Module({
  providers: [PaginationProvider],
  exports: [PaginationProvider],
})
export class PaginationModule {}
