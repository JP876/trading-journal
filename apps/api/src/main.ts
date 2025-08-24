import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser(process.env.JWT_SECRET));
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  // Setup the aws sdk
  const configService = app.get(ConfigService);
  config.update({
    credentials: {
      accessKeyId: configService.get('appConfig.awsAccessKeyId') as string,
      secretAccessKey: configService.get('appConfig.awsSecretAccessKey') as string,
    },
    region: configService.get('appConfig.awsRegion'),
  });

  await app.listen(process.env.PORT ?? 4000);
}

bootstrap();
