import { forwardRef, Inject, Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { type Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';

import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { SignInDto } from '../dtos/signin.dto';
import withCatch from 'src/utils/withCatch';
import { TokenPayload, TokenType } from '../types';
import appConfig from 'src/config/app.config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly hashingProvider: HashingProvider,
    private readonly jwtService: JwtService,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>
  ) {}

  private async signToken(userInfo: TokenPayload, type: TokenType) {
    return await this.jwtService.signAsync(
      { id: userInfo.id, email: userInfo.email },
      {
        audience: this.appConfiguration.jwtTokenAudience,
        issuer: this.appConfiguration.jwtTokenIssuer,
        secret: type === 'ACCESS' ? this.appConfiguration.jwtSecret : this.appConfiguration.jwtSecretRefresh,
        expiresIn:
          type === 'ACCESS'
            ? this.appConfiguration.accessExpirationTime * 1_000
            : this.appConfiguration.refreshExpirationTime * 1_000,
      }
    );
  }

  public async validateUser(signInDto: SignInDto) {
    const user = await this.usersService.findOneBy({ email: signInDto.email });
    const [error, isEqual] = await withCatch(this.hashingProvider.comparePassword(signInDto.password, user.password));

    if (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare passwords',
      });
    }
    if (!isEqual) {
      throw new UnauthorizedException('Incorrect password');
    }
    return user;
  }

  public async attachCookieToResponse(res: Response, userInfo: TokenPayload, type: TokenType) {
    const token = await this.signToken(userInfo, type);

    const expTime =
      type === 'ACCESS' ? this.appConfiguration.accessExpirationTime : this.appConfiguration.refreshExpirationTime;
    const expires = new Date(Date.now() + expTime * 1_000);

    res.cookie(type, token, {
      httpOnly: true,
      signed: true,
      expires,
      secure: this.appConfiguration.environment === 'production',
    });
  }

  public removeCookieFromResponse(res: Response, type: TokenType) {
    res.cookie(type, '', { httpOnly: true, expires: new Date(Date.now() + 1_000) });
  }
}
