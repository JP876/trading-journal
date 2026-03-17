import { Request } from 'express';

import { User } from 'src/users/user.entity';

export type TokenType = 'ACCESS' | 'REFRESH';
export type AuthType = 'COOKIE' | 'NONE';
export type TokenPayload = { id: number; email: string };

export type RequestWithUser<T = User> = Request & {
  user: T;
};
