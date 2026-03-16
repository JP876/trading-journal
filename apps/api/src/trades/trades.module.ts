import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TradesService } from './providers/trades.service';
import { TradesController } from './trades.controller';
import { Trade } from './trade.entity';

@Module({
  controllers: [TradesController],
  providers: [TradesService],
  imports: [TypeOrmModule.forFeature([Trade])],
})
export class TradesModule {}
