import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AccountsController } from './accounts.controller';
import { AccountsService } from './providers/accounts.service';
import { Account, AccountSchema } from './account.schema';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
  imports: [MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }])],
  exports: [AccountsService],
})
export class AccountsModule {}
