import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { AUTH_REFRESH } from '../consts';
import { RefreshTokenPayload } from '../interfaces';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          let token: string | null = null;
          if (req?.signedCookies) token = req?.signedCookies?.[AUTH_REFRESH] as string;
          return token;
        },
      ]),
      secretOrKey: configService.getOrThrow('appConfig.jwtSecretRefresh'),
    });
  }

  public validate(payload: RefreshTokenPayload) {
    return payload;
  }
}
