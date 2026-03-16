import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { NestjsFormDataModule } from 'nestjs-form-data';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TradesModule } from './trades/trades.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import appConfig from './config/app.config';
import envValidation from './config/env.validation';

const ENV = process.env.NODE_ENV;

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist'),
    }),
    NestjsFormDataModule.config({ isGlobal: true }),
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
  ],
})
export class AppModule {}
