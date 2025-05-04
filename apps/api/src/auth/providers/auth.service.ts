import { BadRequestException, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from '../dtos/login.dto';
import { UserService } from 'src/user/providers/user.service';
import AccessTokenPayload from '../interfaces/access-token-payload.interface';
import { cookieAuthAccessKey, cookieAuthRefreshKey } from '../constants';
import { CookieType } from '../enums/cookie.enum';
import RefreshTokenPayload from '../interfaces/refresh-token-payload.interface';

type CookieOptions =
  | { type: CookieType.Access; payload: AccessTokenPayload }
  | { type: CookieType.Refresh; payload: RefreshTokenPayload };

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  public async validateUser(loginDto: LoginDto) {
    const user = await this.userService.findUserByEmail(loginDto.email);
    if (!user) {
      throw new BadRequestException();
    }

    if (!user?.isActive) {
      throw new BadRequestException('The account is currently inactive.');
    }

    const isPasswordMatching = await user.comparePassword(loginDto.password);
    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided');
    }
    return user;
  }

  public async attachCookieToResponse(cookieOptions: CookieOptions, res: Response) {
    let token = '',
      expirationTime = 0,
      expiresIn = new Date(),
      secret = '';

    if (cookieOptions.type === CookieType.Access) {
      // access token
      secret = this.configService.get('appConfig.jwtSecret') as string;
      expirationTime = this.configService.get('appConfig.accessExpirationTime') as number; // in seconds
      expiresIn = new Date(Date.now() + expirationTime * 1_000);

      token = await this.jwtService.signAsync(cookieOptions.payload, { secret, expiresIn: expirationTime * 1_000 });
    } else if (cookieOptions.type === CookieType.Refresh) {
      // refresh token
      secret = this.configService.get('appConfig.jwtSecretRefresh') as string;
      expirationTime = this.configService.get('appConfig.refreshExpirationTime') as number; // in seconds
      expiresIn = new Date(Date.now() + expirationTime * 1_000);

      token = await this.jwtService.signAsync(cookieOptions.payload, { secret, expiresIn: expirationTime * 1_000 });
    }

    res.cookie(cookieOptions.type === CookieType.Access ? cookieAuthAccessKey : cookieAuthRefreshKey, token, {
      httpOnly: true,
      signed: true,
      expires: expiresIn,
      secure: this.configService.get('appConfig.environment') === 'production',
    });
  }

  public removeCookieFromResponse(type: CookieType, res: Response) {
    res.cookie(type === CookieType.Access ? cookieAuthAccessKey : cookieAuthRefreshKey, '', {
      httpOnly: true,
      expires: new Date(Date.now() + 1_000),
    });
  }
}
