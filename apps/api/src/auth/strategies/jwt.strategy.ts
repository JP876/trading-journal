import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { UserService } from 'src/user/providers/user.service';
import AccessTokenPayload from '../interfaces/access-token-payload.interface';
import { User } from 'src/user/user.schema';
import { cookieAuthAccessKey } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.signedCookies?.[cookieAuthAccessKey] as string;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('appConfig.jwtSecret') as string,
    });
  }

  async validate(payload: AccessTokenPayload): Promise<User | null> {
    const user = await this.userService.findUserById(payload.sub);
    return user;
  }
}
