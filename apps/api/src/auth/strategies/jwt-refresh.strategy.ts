import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { cookieAuthRefreshKey } from '../constants';
import RefreshTokenPayload from '../interfaces/refresh-token-payload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          let token: string | null = null;
          if (req?.signedCookies) token = req?.signedCookies?.[cookieAuthRefreshKey] as string;
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
