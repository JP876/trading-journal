import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { AuthType } from '../types';
import { AUTH_TYPE_KEY } from '../consts';

@Injectable()
export default class JwtAuthGuard extends AuthGuard('jwt') {
  private static readonly defaultAuthType: AuthType = 'COOKIE';

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const authType =
      this.reflector.getAllAndOverride<AuthType>(AUTH_TYPE_KEY, [context.getHandler(), context.getClass()]) ??
      JwtAuthGuard.defaultAuthType;

    if (authType === 'NONE') {
      return true;
    }
    return super.canActivate(context);
  }
}
