import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';

import { TradesService } from './providers/trades.service';
import { CreateTradeDto } from './dtos/create-trade.dto';

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

  @Delete(':id')
  public deleteTradingSession(@Param('id') id: number) {
    return this.tradesService.delete(id);
  }
}
