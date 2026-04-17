import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from 'src/common/pagination/dtos/pagination.dto';
import { DirectionOptions, ResultOptions } from '../enums';
import { IsCommaSeparatedNumbers } from 'src/common/validators/IsCommaSeparatedNumbers';

export class GetTradesDto extends PaginationDto {
  @IsOptional()
  @IsNumber()
  tradingSessionId?: number;

  @IsOptional()
  @IsNumber()
  pairId?: number;

  @IsEnum(ResultOptions)
  @IsOptional()
  result?: ResultOptions;

  @IsEnum(DirectionOptions)
  @IsOptional()
  direction?: DirectionOptions;

  @IsDate()
  @IsOptional()
  openDate?: Date;

  @IsDate()
  @IsOptional()
  closeDate?: Date;

  @IsString()
  @IsOptional()
  @IsCommaSeparatedNumbers()
  tags?: string;
}
