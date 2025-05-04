import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

import { UserService } from '../user/providers/user.service';
import { CreateUserDto } from '../user/dtos/create-user-dto';
import { AuthService } from './providers/auth.service';
import RequestWithUser from './interfaces/request-with-user.interface';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth.enum';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CookieType } from './enums/cookie.enum';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import RefreshTokenPayload from './interfaces/refresh-token-payload.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Get()
  public getUser(@Req() request: RequestWithUser) {
    return request?.user;
  }

  @Auth(AuthType.None)
  @Post('register')
  public async create(@Body() createDto: CreateUserDto) {
    return this.userService.create(createDto);
  }

  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@Req() request: RequestWithUser, @Res() response: Response) {
    const user = request.user;

    await this.authService.attachCookieToResponse(
      { type: CookieType.Access, payload: { sub: user._id as string } },
      response
    );
    await this.authService.attachCookieToResponse(
      { type: CookieType.Refresh, payload: { sub: user._id as string } },
      response
    );

    return response.send(user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public logOut(@Res() response: Response) {
    this.authService.removeCookieFromResponse(CookieType.Access, response);
    this.authService.removeCookieFromResponse(CookieType.Refresh, response);

    return response.sendStatus(HttpStatus.OK);
  }

  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  public async refresh(@Req() request: Request, @Res() response: Response) {
    const user = request.user as RefreshTokenPayload;
    await this.authService.attachCookieToResponse({ type: CookieType.Access, payload: { sub: user.sub } }, response);
    return response.send({ _id: user.sub });
  }
}
