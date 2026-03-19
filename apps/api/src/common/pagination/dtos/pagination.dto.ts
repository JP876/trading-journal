import { IsNotEmpty, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsNotEmpty()
  @IsPositive()
  limit: number = 10;

  @IsNotEmpty()
  @IsPositive()
  page: number = 1;
}
