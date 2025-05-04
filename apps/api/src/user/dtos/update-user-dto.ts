import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, MaxLength } from 'class-validator';

import { CreateUserDto } from './create-user-dto';
import { UserSettingsDocument } from '../settings.schema';
import { avatarType } from '../user.schema';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @MaxLength(36)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(36)
  lastName?: string;

  @IsOptional()
  userSettings?: UserSettingsDocument;

  @IsString()
  @IsOptional()
  avatar?: avatarType;
}
