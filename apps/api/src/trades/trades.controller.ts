import { Body, Controller, Get, Post } from '@nestjs/common';

import { TradesService } from './providers/trades.service';
import { CreateTradeDto } from './dtos/create-trade.dto';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('trades')
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @Get()
  public getTrades() {
    return this.tradesService.getAll();
  }

  @Post()
  @FormDataRequest()
  public createTrade(@Body() createTradeDto: CreateTradeDto) {
    return this.tradesService.create(createTradeDto);
  }
}
