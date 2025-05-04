import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { AuthType } from '../enums/auth.enum';
import { authTypeKey } from '../constants';

@Injectable()
export default class JwtAuthGuard extends AuthGuard('jwt') {
  private static readonly defaultAuthType = AuthType.Cookie;

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const authType =
      this.reflector.getAllAndOverride<AuthType>(authTypeKey, [context.getHandler(), context.getClass()]) ??
      JwtAuthGuard.defaultAuthType;

    if (authType === AuthType.None) {
      return true;
    }
    return super.canActivate(context);
  }
}
