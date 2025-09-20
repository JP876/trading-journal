import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  public async findMainAccount(user: User): Promise<Account | null> {
    const result = await this.accountModel.find({ user: user._id, isMain: true });
    if (!Array.isArray(result)) throw new NotFoundException();
    return result[0];
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

    account.title = typeof updateAccountDto?.title === 'string' ? updateAccountDto?.title : account.title;
    account.description =
      typeof updateAccountDto?.description === 'string' ? updateAccountDto?.description : account.description;
    account.isMain = typeof updateAccountDto?.isMain === 'boolean' ? updateAccountDto?.isMain : account.isMain;

    account.defaultTakeProfit =
      typeof updateAccountDto.defaultTakeProfit === 'number'
        ? updateAccountDto?.defaultTakeProfit
        : account?.defaultTakeProfit;
    account.defaultStopLoss =
      typeof updateAccountDto.defaultStopLoss === 'number'
        ? updateAccountDto?.defaultStopLoss
        : account?.defaultStopLoss;

    try {
      await account.save({ validateBeforeSave: true });
      return account;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  public async delete(id: string) {
    const account = await this.findById(id);
    if (!account) {
      throw new NotFoundException();
    }
    await account.deleteOne();
  }
}
