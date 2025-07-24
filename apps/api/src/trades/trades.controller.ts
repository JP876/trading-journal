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

import { TradesService } from './providers/trades.service';
import { CreateTradeDto } from './dtos/create-tradet.dto';
import { UpdateTradeDto } from './dtos/update-trade.dto';
import ParamsWithId from 'src/utils/params-with-id';
import { PaginationParams } from 'src/common/dtos/pagination-params.dto';
import RequestWithUser from 'src/auth/interfaces/request-with-user.interface';
import { TradeFilterFields } from './trade.schema';

@Controller('trades')
export class TradesController {
  constructor(private readonly tradesService: TradesService) {}

  @Get()
  public async findAll(@Req() request: RequestWithUser, @Query() query: PaginationParams & TradeFilterFields) {
    return this.tradesService.findAll(query, request.user);
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

  @Delete(':id')
  public async delete(@Param() { id }: ParamsWithId, @Req() request: RequestWithUser) {
    const userId = request.user.id as string;
    return this.tradesService.delete(userId, id);
  }

  @Delete('file/:trade_id/:file_id')
  public async deleteFile(@Param() param: { trade_id: string; file_id: string }) {
    return this.tradesService.deleteFile(param.trade_id, param.file_id);
  }
}
