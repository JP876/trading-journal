import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TradingSessionsController } from './trading-sessions.controller';
import { TradingSessionsService } from './providers/trading-sessions.service';
import { TradingSession } from './trading-session.entity';

@Module({
  controllers: [TradingSessionsController],
  providers: [TradingSessionsService],
  imports: [TypeOrmModule.forFeature([TradingSession])],
})
export class TradingSessionsModule {}
