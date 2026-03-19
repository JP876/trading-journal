import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());
  app.use(cookieParser(process.env.JWT_SECRET));
  app.setGlobalPrefix('api/v1');
  app.set('trust proxy', 'loopback');

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
