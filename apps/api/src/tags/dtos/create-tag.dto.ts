import { IsHexColor, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @MinLength(2)
  @MaxLength(256)
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsHexColor()
  color: string;
}
