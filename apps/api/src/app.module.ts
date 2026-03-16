import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { NestjsFormDataModule } from 'nestjs-form-data';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TradesModule } from './trades/trades.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist'),
    }),
    NestjsFormDataModule.config({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'trading_journal.db',
      synchronize: true,
      autoLoadEntities: true,
    }),
    TradesModule,
  ],
})
export class AppModule {}
