import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';

import { AccountsService } from './providers/accounts.service';
import RequestWithUser from 'src/auth/interfaces/request-with-user.interface';
import { CreateAccountDto } from './dtos/create-account.dto';
import ParamsWithId from 'src/utils/params-with-id';
import { UpdateAccountDto } from './dtos/update-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  public async getAccounts(@Req() request: RequestWithUser) {
    return await this.accountsService.findAll(request.user);
  }

  @Get(':id')
  public async getSingleAccount(@Param() { id }: ParamsWithId) {
    return await this.accountsService.findById(id);
  }

  @Post()
  public async createAccount(@Req() request: RequestWithUser, @Body() createDto: CreateAccountDto) {
    return await this.accountsService.create(createDto, request.user);
  }

  @Patch(':id')
  public async updateAccount(@Param() { id }: ParamsWithId, @Body() updateDto: UpdateAccountDto) {
    return await this.accountsService.update(id, updateDto);
  }

  @Delete(':id')
  public async deleteAccount(@Param() { id }: ParamsWithId) {
    return this.accountsService.delete(id);
  }
}
