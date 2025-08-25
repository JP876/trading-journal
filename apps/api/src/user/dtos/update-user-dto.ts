import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, MaxLength } from 'class-validator';

import { CreateUserDto } from './create-user-dto';
import { UserSettingsDocument } from '../settings.schema';

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

  @IsOptional()
  readonly files: string[];
}
