import { IsDate, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateTradeDto {
  @IsDate()
  @IsOptional()
  openDate?: Date;

  @IsDate()
  @IsOptional()
  closeDate?: Date;

  @IsNumber()
  @IsOptional()
  stopLoss: number;

  @IsNumber()
  @IsOptional()
  takeProfit: number;
}
