import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

import { ClosedBy, DirectionOptions, OrderType, ResultOptions } from '../enums';

export class CreateTradeDto {
  @IsNotEmpty()
  @IsNumber()
  pairId: number;

  @IsNotEmpty()
  @IsNumber()
  tradingSessionId: number;

  @IsEnum(ResultOptions)
  @IsNotEmpty()
  result: ResultOptions;

  @IsNumber()
  @IsNotEmpty()
  positionSize: number;

  @IsEnum(DirectionOptions)
  @IsNotEmpty()
  direction: DirectionOptions;

  @IsNumber()
  @IsOptional()
  stopLoss?: number;

  @IsNumber()
  @IsOptional()
  stopLossPrice?: number;

  @IsNumber()
  @IsOptional()
  takeProfit?: number;

  @IsNumber()
  @IsOptional()
  takeProfitPrice?: number;

  @IsDate()
  @IsOptional()
  openDate?: Date;

  @IsDate()
  @IsOptional()
  closeDate?: Date;

  @IsEnum(ClosedBy)
  @IsOptional()
  closedBy?: ClosedBy;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) => {
    return String(value)
      .split(',')
      .map((item) => Number(item));
  })
  tags?: number[];

  @ValidateIf((obj: CreateTradeDto) => obj.closedBy === ClosedBy.USER)
  @IsNumber()
  @IsNotEmpty()
  closedAt?: number;

  @IsEnum(OrderType)
  @IsOptional()
  orderType?: OrderType;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsNumber()
  @IsOptional()
  profit?: number;

  @IsNumber()
  @IsOptional()
  entryPrice?: number;

  @IsNumber()
  @IsOptional()
  closePrice?: number;
}
