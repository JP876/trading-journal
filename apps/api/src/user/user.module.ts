import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './user.controller';
import { UserService } from './providers/user.service';
import { User, UserSchema } from './user.schema';
import { AccountsModule } from 'src/accounts/accounts.module';
import { UploadsModule } from 'src/uploads/uploads.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), AccountsModule, UploadsModule],
})
export class UserModule {}
