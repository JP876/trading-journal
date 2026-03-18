import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';

import { TradingSessionsService } from './providers/trading-sessions.service';
import { RequestWithUser } from 'src/auth/types';
import { CreateTradingSession } from './dtos/create-trading-session.dto';
import { UpdateTradingSession } from './dtos/update-trading-session.dto';

@Controller('trading-sessions')
export class TradingSessionsController {
  constructor(private readonly tradingSessionService: TradingSessionsService) {}

  @Get()
  public getTradingSessions(@Req() requset: RequestWithUser) {
    return this.tradingSessionService.findAll(requset.user);
  }

  @Post()
  @FormDataRequest()
  public createTradingSession(@Req() requset: RequestWithUser, @Body() session: CreateTradingSession) {
    return this.tradingSessionService.create(requset.user, session);
  }

  @Patch(':id')
  @FormDataRequest()
  public updateTradingSession(@Body() session: UpdateTradingSession, @Param('id') id: number) {
    return this.tradingSessionService.update(id, session);
  }

  @Delete(':id')
  public deleteTradingSession(@Param('id') id: number) {
    return this.tradingSessionService.delete(id);
  }
}
