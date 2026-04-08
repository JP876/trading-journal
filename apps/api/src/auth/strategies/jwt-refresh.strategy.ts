import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { AUTH_REFRESH } from '../consts';
import { RefreshTokenPayload } from '../interfaces';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          let token: string | null = null;
          if (req?.signedCookies) token = req?.signedCookies?.[AUTH_REFRESH] as string;
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('appConfig.jwtSecretRefresh'),
    });
  }

  public async validate(payload: RefreshTokenPayload) {
    await this.usersService.findOneBy({ id: payload.id });
    return payload;
  }
}
