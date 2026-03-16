import { Body, Controller, Post } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';

import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/providers/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @FormDataRequest()
  public async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
