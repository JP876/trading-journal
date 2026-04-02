import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TradesService } from './providers/trades.service';
import { TradesController } from './trades.controller';
import { Trade } from './trade.entity';
import { PairsModule } from 'src/pairs/pairs.module';
import { TradingSessionsModule } from 'src/trading-sessions/trading-sessions.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  controllers: [TradesController],
  providers: [TradesService],
  imports: [TypeOrmModule.forFeature([Trade]), PaginationModule, PairsModule, TradingSessionsModule, TagsModule],
})
export class TradesModule {}
