import {
  IsDate,
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
  defaultStopLoss?: number;

  @IsNumber()
  @IsOptional()
  defaultTakeProfit?: number;

  @IsDate()
  @IsOptional()
  defaultOpenDate?: Date;
}
