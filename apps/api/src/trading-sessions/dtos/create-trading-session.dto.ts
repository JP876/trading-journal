import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { CurrencyOptions } from '../enums';

export class CreateTradingSessionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(96)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(400)
  description?: string;

  @IsEnum(CurrencyOptions)
  @IsOptional()
  currency?: CurrencyOptions;

  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  accountSize: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(1)
  isMain?: number;

  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  defaultPairId?: number;

  @IsNumber()
  @IsOptional()
  defaultPositionSize?: number;

  @IsNumber()
  @IsOptional()
  defaultStopLoss?: number;

  @IsNumber()
  @IsOptional()
  defaultTakeProfit?: number;

  @IsDate()
  @IsOptional()
  defaultOpenDate?: Date;
}
