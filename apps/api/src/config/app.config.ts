import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  environment: process.env.NODE_ENV || 'production',
  port: process.env.PORT || 4000,
  throttleTtl: process.env.THROTTLE_TTL,
  throttleLimit: process.env.THROTTLE_LIMIT,
  dbName: process.env.DB_NAME,
  dbSynchronize: process.env.DB_SYNCHRONIZE,
  dbEnableWal: process.env.DB_ENABLE_WAL,
  jwtSecret: process.env.JWT_SECRET,
  jwtSecretRefresh: process.env.JWT_SECRET_REFRESH,
  accessExpirationTime: parseInt(process.env.ACCESS_EXPIRATION_TIME || '600'), // in seconds
  refreshExpirationTime: parseInt(process.env.REFRESH_EXPIRATION_TIME || '3600'), // in seconds
  jwtTokenAudience: process.env.JWT_TOKEN_AUDIENCE,
  jwtTokenIssuer: process.env.JWT_TOKEN_ISSUER,
}));
