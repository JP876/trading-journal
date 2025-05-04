import { SetMetadata } from '@nestjs/common';

import { AuthType } from '../enums/auth.enum';
import { authTypeKey } from '../constants';

export const Auth = (auth: AuthType) => {
  return SetMetadata(authTypeKey, auth);
};
