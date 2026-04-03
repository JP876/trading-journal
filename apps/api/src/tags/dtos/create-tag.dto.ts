import { IsHSL, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @MinLength(2)
  @MaxLength(256)
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsHSL()
  color: string;
}
