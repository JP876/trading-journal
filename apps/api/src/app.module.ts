import { ClassSerializerInterceptor, Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE, Reflector } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TradesModule } from './trades/trades.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TradingSessionsModule } from './trading-sessions/trading-sessions.module';
import { PairsModule } from './pairs/pairs.module';
import appConfig from './config/app.config';
import envValidation from './config/env.validation';
import JwtAuthGuard from './auth/guards/jwt-auth.guard';

const ENV = process.env.NODE_ENV;

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    {
      provide: APP_PIPE,
      useFactory: () => {
        return new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
          transformOptions: {
            enableImplicitConversion: true,
          },
        });
      },
    },
    {
      provide: APP_INTERCEPTOR,
      inject: [Reflector],
      useFactory: (reflector: Reflector) => {
        return new ClassSerializerInterceptor(reflector);
      },
    },
  ],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist'),
    }),
    NestjsFormDataModule.config({ isGlobal: true }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          { ttl: +configService.get('appConfig.throttleTtl'), limit: +configService.get('appConfig.throttleLimit') },
        ],
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: !ENV ? join(__dirname, '../../..', '.env') : join(__dirname, '../../..', `.env.${ENV}`),
      validationSchema: envValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'better-sqlite3',
        database: configService.get('appConfig.dbName'),
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    TradesModule,
    AuthModule,
    UsersModule,
    TradingSessionsModule,
    PairsModule,
  ],
})
export class AppModule {}
