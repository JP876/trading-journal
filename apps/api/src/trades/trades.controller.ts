import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import mongoose from 'mongoose';

import { TradesService } from './providers/trades.service';
import { CreateTradeDto } from './dtos/create-tradet.dto';
import { UpdateTradeDto } from './dtos/update-trade.dto';
import ParamsWithId from 'src/utils/params-with-id';
import { PaginationParams } from 'src/common/dtos/pagination-params.dto';
import RequestWithUser from 'src/auth/interfaces/request-with-user.interface';
import { TradeFilterFields } from './trade.schema';
import { StatsService } from './providers/stats.service';
import { tradeResult } from './enums';

@Controller('trades')
export class TradesController {
  constructor(
    private readonly tradesService: TradesService,
    private readonly statsService: StatsService
  ) {}

  @Get()
  public async findAll(
    @Req() request: RequestWithUser,
    @Query() query: PaginationParams & TradeFilterFields & { sort: string }
  ) {
    return this.tradesService.findAll(query, request.user);
  }

  @Get('stats/num-of-trades-per-day/:id')
  public async findNumOfTradesPerDay(@Param() { id }: ParamsWithId) {
    const accountId = new mongoose.Types.ObjectId(id);
    return this.statsService.getNumOfTradesPerDay(accountId);
  }

  @Get('stats/grouped-by-results/:id')
  public async groupByResults(@Param() { id }: ParamsWithId) {
    const accountId = new mongoose.Types.ObjectId(id);
    return this.statsService.groupTradesByResults(accountId);
  }

  @Get('stats/grouped-by-pairs/:id')
  public async groupByPairs(@Param() { id }: ParamsWithId) {
    const accountId = new mongoose.Types.ObjectId(id);
    return this.statsService.groupTradesByPairs(accountId);
  }

  @Get('stats/most-profitable-pairs/:id')
  public async findMostProfitablePairs(@Param() { id }: ParamsWithId) {
    const accountId = new mongoose.Types.ObjectId(id);
    return this.statsService.findMostProfitablePairs(accountId);
  }

  @Get('stats/general-info/:id')
  public async findGeneralInfo(@Param() { id }: ParamsWithId) {
    const accountId = new mongoose.Types.ObjectId(id);

    const consecutiveLosses = await this.statsService.findMostConsecutiveResults(accountId, tradeResult.LOSS);
    const consecutiveWins = await this.statsService.findMostConsecutiveResults(accountId, tradeResult.WIN);
    const generalInfo = await this.statsService.findGeneralInfo(accountId);
    const winRateByDirection = await this.statsService.findWinRateByDirection(accountId);
    const tradesPerWeek = await this.statsService.findAverageNumberOfTradesPerWeek(accountId);

    if (generalInfo && '_id' in generalInfo) delete generalInfo._id;

    return {
      consecutiveLosses: consecutiveLosses?.count || 0,
      consecutiveWins: consecutiveWins?.count || 0,
      ...(generalInfo || {}),
      winRateByDirection,
      ...(tradesPerWeek || {}),
    };
  }

  @Get(':id')
  public async findOneById(@Param() { id }: ParamsWithId) {
    return this.tradesService.findOneById(id);
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', Infinity, {
      storage: memoryStorage(),
      limits: { fileSize: 2097152 },
      fileFilter: (req, file, callback) => {
        return file.mimetype.match(/image\/(jpg|jpeg|png|gif)$/)
          ? callback(null, true)
          : callback(new BadRequestException('Only image files are allowed'), false);
      },
    })
  )
  public async create(
    @Req() request: RequestWithUser,
    @Body() createDto: CreateTradeDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.tradesService.create(createDto, request.user, files);
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('files', Infinity, {
      storage: memoryStorage(),
      limits: { fileSize: 2097152 },
      fileFilter: (req, file, callback) => {
        return file.mimetype.match(/image\/(jpg|jpeg|png|gif)$/)
          ? callback(null, true)
          : callback(new BadRequestException('Only image files are allowed'), false);
      },
    })
  )
  public async update(
    @Req() request: RequestWithUser,
    @Param() { id }: ParamsWithId,
    @Body() updateDto: UpdateTradeDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.tradesService.update(request.user, id, updateDto, files);
  }

  @Delete('file/:trade_id/:file_name')
  public async deleteFile(@Param() param: { trade_id: string; file_name: string }) {
    return this.tradesService.deleteFile(param.trade_id, param.file_name);
  }

  @Delete(':id')
  public async delete(@Param() { id }: ParamsWithId, @Req() request: RequestWithUser) {
    const userId = request.user.id as string;
    return this.tradesService.delete(userId, id);
  }
}
