import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Account } from '../account.schema';
import { User } from 'src/user/user.schema';
import { CreateAccountDto } from '../dtos/create-account.dto';
import { UpdateAccountDto } from '../dtos/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(@InjectModel(Account.name) private readonly accountModel: Model<Account>) {}

  public async findAll(user: User): Promise<Account[] | null> {
    const results = await this.accountModel.find({ user: user._id });
    return results;
  }

  public async findById(id: string): Promise<Account | null> {
    const result = await this.accountModel.findById(id);
    return result;
  }

  public async findMainAccount(user: User): Promise<Account[] | null> {
    const result = await this.accountModel.find({ user: user._id, isMain: true });
    return result;
  }

  public async create(createAccountDto: CreateAccountDto, user: User) {
    const created = await this.accountModel.create({ ...createAccountDto, user: user._id });
    return created;
  }

  public async update(id: string, updateAccountDto: UpdateAccountDto): Promise<Account | null> {
    const account = await this.findById(id);
    if (!account) {
      throw new NotFoundException();
    }

    account.title = updateAccountDto?.title || account.title;
    account.description = updateAccountDto?.description || account.description;
    account.isMain = updateAccountDto?.isMain || account.isMain;

    await account.save({ validateBeforeSave: true });
    return account;
  }

  public async delete(id: string) {
    const account = await this.findById(id);
    if (!account) {
      throw new NotFoundException();
    }
    await account.deleteOne();
  }
}
