import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

import { DirectionOptions, ResultOptions } from '../enums';

export class CreateTradeDto {
  @IsNotEmpty()
  @IsNumber()
  pairId: number;

  @IsDate()
  @IsOptional()
  openDate?: Date;

  @IsDate()
  @IsOptional()
  closeDate?: Date;

  @IsNumber()
  @IsOptional()
  stopLoss: number;

  @IsNumber()
  @IsOptional()
  takeProfit: number;

  @IsNotEmpty()
  @IsNumber()
  tradingSessionId: number;

  @IsEnum(ResultOptions)
  @IsNotEmpty()
  result: ResultOptions;

  @IsEnum(DirectionOptions)
  @IsNotEmpty()
  direction: DirectionOptions;
}
