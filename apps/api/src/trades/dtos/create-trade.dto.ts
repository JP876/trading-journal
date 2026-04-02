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

  @IsEnum(DirectionOptions)
  @IsNotEmpty()
  direction: DirectionOptions;

  @IsNumber()
  @IsOptional()
  stopLoss?: number;

  @IsNumber()
  @IsOptional()
  takeProfit?: number;

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
  entryPrice?: number;
}
