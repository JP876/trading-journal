import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsOptional()
  readonly description?: string;

  @IsBoolean()
  @IsOptional()
  readonly isMain?: boolean;

  @IsNumber()
  @IsOptional()
  readonly defaultStopLoss?: number;

  @IsNumber()
  @IsOptional()
  readonly defaultTakeProfit?: number;
}
