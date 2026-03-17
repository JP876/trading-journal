import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { type Response as ExpressResponse } from 'express';

import { AuthService } from '../providers/auth.service';
import { RequestWithUser } from '../types';

@Injectable()
export class RefreshInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const response: ExpressResponse = context.switchToHttp().getResponse();
    const request: RequestWithUser = context.switchToHttp().getRequest();

    await this.authService.attachCookieToResponse(response, request.user, 'ACCESS');

    return next.handle();
  }
}
