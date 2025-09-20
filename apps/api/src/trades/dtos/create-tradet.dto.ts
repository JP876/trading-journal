import { IsDate, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

import { closedBy, orderType, tradeDirection, tradeResult } from '../enums';

export class CreateTradeDto {
  @IsDate()
  @IsOptional()
  readonly openDate?: Date;

  @IsDate()
  @IsOptional()
  readonly closeDate?: Date;

  @IsNotEmpty()
  readonly pair: string;

  @IsEnum(tradeResult)
  @IsNotEmpty()
  readonly result: tradeResult;

  @IsEnum(closedBy)
  @IsOptional()
  readonly closedBy?: closedBy;

  @IsNumber()
  @IsOptional()
  readonly closedAt?: number;

  @IsNumber()
  @IsNotEmpty()
  readonly stopLoss: number;

  @IsNumber()
  @IsNotEmpty()
  readonly takeProfit: number;

  @IsEnum(tradeDirection)
  @IsNotEmpty()
  readonly direction: tradeDirection;

  @IsEnum(orderType)
  @IsNotEmpty()
  readonly orderType: orderType;

  @IsNumber({ maxDecimalPlaces: 4 })
  @IsOptional()
  readonly pl?: number;

  @IsOptional()
  readonly comment?: string;

  @IsOptional()
  @IsMongoId()
  readonly account?: string;

  @IsOptional()
  readonly files: string[] | string;

  @IsOptional()
  readonly tags?: string[] | string;
}
