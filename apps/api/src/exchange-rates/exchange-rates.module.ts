import { Module } from '@nestjs/common';

import { ExchangeRatesController } from './exchange-rates.controller';
import { ExchangeRatesService } from './providers/exchange-rates.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ExchangeRates, ExchangeRatesSchema } from './exchange-rates.schema';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [ExchangeRatesController],
  providers: [ExchangeRatesService],
  imports: [
    MongooseModule.forFeature([{ name: ExchangeRates.name, schema: ExchangeRatesSchema }]),
    ScheduleModule.forRoot(),
  ],
})
export class ExchangeRatesModule {}
