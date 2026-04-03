import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from 'src/common/pagination/dtos/pagination.dto';

export class GetTagsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  title?: string;
}
