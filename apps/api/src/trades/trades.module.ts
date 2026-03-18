import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TradesService } from './providers/trades.service';
import { TradesController } from './trades.controller';
import { Trade } from './trade.entity';
import { PairsModule } from 'src/pairs/pairs.module';
import { TradingSessionsModule } from 'src/trading-sessions/trading-sessions.module';

@Module({
  controllers: [TradesController],
  providers: [TradesService],
  imports: [TypeOrmModule.forFeature([Trade]), PairsModule, TradingSessionsModule],
})
export class TradesModule {}
