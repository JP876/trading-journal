import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';

import { TradesService } from './providers/trades.service';
import { CreateTradeDto } from './dtos/create-trade.dto';
import { UpdateTradeDto } from './dtos/update-trade.dto';
import { GetTradesDto } from './dtos/get-trades.dto';

@Controller('trades')
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @Get()
  public getTrades(@Query() tradesQuery: GetTradesDto) {
    return this.tradesService.findAll(tradesQuery);
  }

  @Get(':id')
  public getTradeById(@Param('id') id: number) {
    return this.tradesService.findOneBy({ id });
  }

  @Post()
  @FormDataRequest()
  public createTrade(@Body() createTradeDto: CreateTradeDto) {
    return this.tradesService.create(createTradeDto);
  }

  @Patch(':id')
  @FormDataRequest()
  public updateTrade(@Param('id') id: number, @Body() updateTradeDto: UpdateTradeDto) {
    return this.tradesService.update(id, updateTradeDto);
  }

  @Delete(':id')
  public deleteTradingSession(@Param('id') id: number) {
    return this.tradesService.delete(id);
  }
}
