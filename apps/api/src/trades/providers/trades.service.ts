import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateTradeDto } from '../dtos/create-tradet.dto';
import { UpdateTradeDto } from '../dtos/update-trade.dto';
import { Trade } from '../trade.schema';
import { PaginationParams } from 'src/common/dtos/pagination-params.dto';
import { User } from 'src/user/user.schema';
import { Account } from 'src/accounts/account.schema';
import { AccountsService } from 'src/accounts/providers/accounts.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileType } from 'src/common/types';

@Injectable()
export class TradesService {
  constructor(
    @InjectModel(Trade.name) private readonly tradeModel: Model<Trade>,
    private readonly accountsService: AccountsService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  public async findAll({ limit = 10, page = 1 }: PaginationParams, user: User) {
    if (page < 1) {
      throw new NotFoundException();
    }

    const accounts = await this.accountsService.findMainAccount(user);
    if (!Array.isArray(accounts)) {
      throw new NotFoundException();
    }

    const newPage = limit * (page - 1);
    const tradesQuery = this.tradeModel
      .find({ account: accounts[0]?._id })
      .sort({ _id: -1 })
      .skip(newPage)
      .limit(limit);

    const results = await tradesQuery;
    const count = await this.tradeModel.find({ account: accounts[0]?._id }).countDocuments();

    return { count, results };
  }

  public async findOneById(id: string): Promise<Trade | null> {
    return this.tradeModel.findById(id).exec();
  }

  public async create(createTradeDto: CreateTradeDto, user: User, files?: Express.Multer.File[]): Promise<Trade> {
    const userId = user._id as string;
    let account: Account | null = null;

    if (createTradeDto?.account) {
      account = await this.accountsService.findById(createTradeDto.account);
      if (account === null || !account?.isMain) {
        throw new NotFoundException();
      }
    } else {
      const accounts = await this.accountsService.findMainAccount(user);
      if (!Array.isArray(accounts)) {
        throw new NotFoundException();
      }
      account = accounts[0];
    }

    const trade = await this.tradeModel.create({ ...createTradeDto, user: userId, account });

    if (Array.isArray(files) && files.length !== 0) {
      const tradeFiles = await Promise.all(
        files.map((file) => this.cloudinaryService.uploadFile(file, userId, { folder: `trades/${trade?.id}` }))
      );
      trade.files = tradeFiles.map((file) => ({
        url: file?.secure_url as string,
        id: file?.public_id as string,
        name: file?.original_filename as string,
      }));
      await trade.save({ validateBeforeSave: true });
    }

    return trade;
  }

  public async update(user: User, id: string, updateTradeDto: UpdateTradeDto, files: Express.Multer.File[]) {
    const userId = user._id as string;
    const trade = await this.findOneById(id);

    if (!trade) {
      throw new NotFoundException();
    }

    let updatedfiles: FileType[] = [...(trade?.files || [])];
    const updateData = { ...updateTradeDto };

    delete updateData.deleteFiles;

    if (updateTradeDto?.deleteFiles) {
      const fileIds = JSON.parse(updateTradeDto.deleteFiles || '') as string[] | '';

      if (Array.isArray(fileIds) && fileIds.length !== 0) {
        await Promise.all(fileIds.map((id) => this.cloudinaryService.deleteFile(id)));
        updatedfiles = updatedfiles.filter((file) => !fileIds.includes(file.id));
      }
    }

    if (Array.isArray(files) && files.length !== 0) {
      const tradeFiles = await Promise.all(
        files.map((file) => this.cloudinaryService.uploadFile(file, userId, { folder: `trades/${trade?.id}` }))
      );

      updatedfiles = [
        ...updatedfiles,
        ...tradeFiles.map((file) => ({
          url: file?.secure_url as string,
          id: file?.public_id as string,
          name: files?.[0]?.originalname,
        })),
      ];
    }

    await this.tradeModel.updateOne({ _id: id }, { ...updateData, files: updatedfiles });
  }

  public async deleteFile(tradeId: string, fileId: string) {
    const trade = await this.findOneById(tradeId);
    if (!trade) {
      throw new NotFoundException();
    }

    trade.files = (trade.files || []).filter((file) => file.id !== fileId);
    await trade.save();

    return this.cloudinaryService.deleteFile(fileId);
  }

  public async delete(userId: string, id: string) {
    const trade = await this.findOneById(id);
    if (!trade) {
      throw new NotFoundException();
    }

    if (Array.isArray(trade?.files) && trade?.files.length !== 0) {
      await this.cloudinaryService.deleteFolderWithAssets(userId, `trades/${id}`);
    }

    await trade.deleteOne();
  }
}
