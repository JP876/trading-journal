import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import environmentValidation from './config/environment.validation';
import { TradesModule } from './trades/trades.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AccountsModule } from './accounts/accounts.module';
import { UploadsModule } from './uploads/uploads.module';
import JwtAuthGuard from './auth/guards/jwt-auth.guard';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '../..', 'frontend', 'dist') }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: !ENV ? join(__dirname, '../../..', '.env') : join(__dirname, '../../..', `.env.${ENV}`),
      validationSchema: environmentValidation,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('appConfig.mongoUri'),
        dbName: configService.get('appConfig.mongoDbName'),
      }),
    }),
    TradesModule,
    AuthModule,
    UserModule,
    AccountsModule,
    UploadsModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
