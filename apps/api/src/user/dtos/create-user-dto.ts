import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @MinLength(4)
  @MaxLength(96)
  userName?: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(96)
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({ minLength: 8, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 })
  password: string;
}
