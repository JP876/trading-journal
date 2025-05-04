import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsOptional()
  readonly description?: string;

  @IsBoolean()
  @IsOptional()
  readonly isMain?: boolean;
}
