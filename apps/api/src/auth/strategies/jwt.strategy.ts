import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

import { UsersService } from 'src/users/providers/users.service';
import { AUTH_ACCESS } from '../consts';
import { User } from 'src/users/user.entity';
import { AccessTokenPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.signedCookies?.[AUTH_ACCESS] as string;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('appConfig.jwtSecret'),
    });
  }

  async validate(payload: AccessTokenPayload): Promise<User | null> {
    const user = await this.userService.findOneBy({ id: payload.id });
    return user;
  }
}
