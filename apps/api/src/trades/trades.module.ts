import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TradesController } from './trades.controller';
import { TradesService } from './providers/trades.service';
import { Trade, TradeSchema } from './trade.schema';
import { AccountsModule } from 'src/accounts/accounts.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [TradesController],
  providers: [TradesService],
  imports: [MongooseModule.forFeature([{ name: Trade.name, schema: TradeSchema }]), AccountsModule, CloudinaryModule],
})
export class TradesModule {}
