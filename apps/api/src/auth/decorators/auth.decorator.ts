import { SetMetadata } from '@nestjs/common';

import { AuthType } from '../types';
import { AUTH_TYPE_KEY } from '../consts';

export const Auth = (auth: AuthType) => {
  return SetMetadata(AUTH_TYPE_KEY, auth);
};
