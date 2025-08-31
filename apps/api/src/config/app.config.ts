import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  environment: process.env.NODE_ENV || 'production',
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI,
  mongoDbName: process.env.MONGO_DB_NAME,
  jwtSecret: process.env.JWT_SECRET,
  jwtSecretRefresh: process.env.JWT_SECRET_REFRESH,
  accessExpirationTime: parseInt(process.env.ACCESS_EXPIRATION_TIME || '600'), // in seconds
  refreshExpirationTime: parseInt(process.env.REFRESH_EXPIRATION_TIME || '3600'), // in seconds
  jwtTokenAudience: process.env.JWT_TOKEN_AUDIENCE,
  jwtTokenIssuer: process.env.JWT_TOKEN_ISSUER,
  // cloudinary
  cloudName: process.env.CLOUD_NAME,
  cloudApiKey: process.env.CLOUD_API_KEY,
  cloudApiSecret: process.env.CLOUD_API_SECRET,
  // AWS
  awsBucketName: process.env.AWS_PUBLIC_BUCKET_NAME,
  awsRegion: process.env.AWS_REGION,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsCloudfrontUrl: process.env.AWS_CLOUDFRONT_URL,
  // opne exchange rates
  exchangeRatesApiKey: process.env.EXCHANGE_RATES_API_KEY,
}));
