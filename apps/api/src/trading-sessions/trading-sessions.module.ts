import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TradingSessionsController } from './trading-sessions.controller';
import { TradingSessionsService } from './providers/trading-sessions.service';
import { TradingSession } from './trading-session.entity';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  controllers: [TradingSessionsController],
  providers: [TradingSessionsService],
  imports: [TypeOrmModule.forFeature([TradingSession]), PaginationModule],
  exports: [TradingSessionsService],
})
export class TradingSessionsModule {}
