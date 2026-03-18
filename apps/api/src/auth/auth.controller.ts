import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';

import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UsersService } from 'src/users/providers/users.service';
import { Auth } from './decorators/auth.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserResultType } from 'src/users/types';
import { LoginInterceptor } from './interceptors/login.interceptor';
import { LogoutInterceptor } from './interceptors/logout.interceptor';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { RefreshInterceptor } from './interceptors/refresh.interceptor';
import { RequestWithUser } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Auth('NONE')
  @HttpCode(HttpStatus.OK)
  @Post('register')
  public async registerUser(@Body() createUserDto: CreateUserDto): Promise<UserResultType> {
    const user = await this.usersService.create(createUserDto);
    return user;
  }

  @Auth('NONE')
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(LoginInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  public loginUser(@Req() request: RequestWithUser) {
    return request.user;
  }

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(LogoutInterceptor)
  @Post('logout')
  public logOut() {
    return { message: 'Success' };
  }

  @Auth('NONE')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshAuthGuard)
  @UseInterceptors(RefreshInterceptor)
  @Post('refresh')
  public refresh(@Req() request: RequestWithUser) {
    return { id: request.user.id };
  }
}
