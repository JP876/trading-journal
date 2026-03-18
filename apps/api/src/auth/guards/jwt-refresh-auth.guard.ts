import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { type Response as ExpressResponse } from 'express';

import { User } from 'src/users/user.entity';
import { AuthService } from '../providers/auth.service';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  handleRequest<TUser = User | boolean>(err: any, user: TUser, info: any, context: ExecutionContext): TUser {
    if (!user || err || info instanceof Error) {
      const response = context.switchToHttp().getResponse<ExpressResponse>();

      this.authService.removeCookieFromResponse(response, 'ACCESS');
      this.authService.removeCookieFromResponse(response, 'REFRESH');

      if (info instanceof Error) {
        throw new UnauthorizedException('Unauthorized', { description: info.message });
      } else if (!user) {
        throw new UnauthorizedException('Unauthorized', { description: 'User info not found' });
      } else {
        throw new UnauthorizedException('Unauthorized');
      }
    }

    return user;
  }
}
