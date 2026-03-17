import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { type Response as ExpressResponse } from 'express';

import { AuthService } from '../providers/auth.service';

@Injectable()
export class LogoutInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthService) {}

  intercept(context: ExecutionContext, next: CallHandler<any>) {
    const response: ExpressResponse = context.switchToHttp().getResponse();

    this.authService.removeCookieFromResponse(response, 'ACCESS');
    this.authService.removeCookieFromResponse(response, 'REFRESH');

    return next.handle();
  }
}
