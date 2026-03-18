import { IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateTradingSession {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(96)
  title: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(200)
  description?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(1)
  isMain?: number;
}
