import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from 'src/common/pagination/dtos/pagination.dto';

export class GetTradingSessions extends PaginationDto {
  @IsOptional()
  @IsString()
  title?: string;
}
