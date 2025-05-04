import { PartialType } from '@nestjs/mapped-types';

import { CreateTradeDto } from './create-tradet.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTradeDto extends PartialType(CreateTradeDto) {
  @IsOptional()
  @IsString()
  readonly deleteFiles?: string;
}
