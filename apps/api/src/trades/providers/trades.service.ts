import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateTradeDto } from '../dtos/create-tradet.dto';
import { UpdateTradeDto } from '../dtos/update-trade.dto';
import { Trade, type TradeFilterFields } from '../trade.schema';
import { PaginationParams } from 'src/common/dtos/pagination-params.dto';
import { User } from 'src/user/user.schema';
import { Account } from 'src/accounts/account.schema';
import { AccountsService } from 'src/accounts/providers/accounts.service';
import { UploadsService } from 'src/uploads/providers/uploads.service';
import { UploadFile } from 'src/uploads/interfaces/upload-file.interface';

@Injectable()
export class TradesService {
  constructor(
    @InjectModel(Trade.name) private readonly tradeModel: Model<Trade>,
    private readonly accountsService: AccountsService,
    private readonly uploadsService: UploadsService
  ) {}

  private formatTags(tags: string | string[] | undefined) {
    let t: string[] = [];
    if (Array.isArray(tags)) {
      t = tags;
    } else if (typeof tags === 'string' && tags !== '') {
      t = [tags];
    }
    return t;
  }

  public async findAll(
    { limit = 10, page = 1, sort, ...rest }: PaginationParams & TradeFilterFields & { sort: string; tags?: string },
    user: User
  ): Promise<{ results: Trade[]; totalCount: number; count: number }> {
    if (page < 1) {
      throw new NotFoundException();
    }

    const account = await this.accountsService.findMainAccount(user);
    if (!account) return { totalCount: 0, count: 0, results: [] };

    const findBy: Omit<TradeFilterFields, 'openDate' | 'closeDate'> & {
      account: unknown;
      openDate?: { $gte: Date };
      closeDate?: { $lte: Date };
      tags?: { $in: string[] };
    } = {
      account: account._id,
    };

    if (rest?.pair) findBy.pair = rest.pair;
    if (rest?.direction) findBy.direction = rest.direction;
    if (rest?.result) findBy.result = rest.result;
    if (rest?.openDate) findBy.openDate = { $gte: new Date(rest.openDate) };
    if (rest?.closeDate) findBy.closeDate = { $lte: new Date(rest.closeDate) };
    if (rest?.tags) findBy.tags = { $in: rest.tags.split(',') };

    const newPage = limit * (page - 1);
    const tradesQuery = this.tradeModel
      .find({ ...findBy })
      .sort(sort ? sort : '-_id')
      .skip(newPage)
      .limit(limit)
      .populate(['tags']);

    const results = await tradesQuery;
    const totalCount = await this.tradeModel.find({ account: account._id }).countDocuments();
    let count = totalCount;

    if (Object.keys(findBy).length > 1) {
      count = await this.tradeModel.find({ ...findBy }).countDocuments();
    }

    return { totalCount, results, count };
  }

  public async findOneById(id: string): Promise<Trade | null> {
    return this.tradeModel.findById(id).populate('tags').exec();
  }

  public async create(createTradeDto: CreateTradeDto, user: User, files?: Express.Multer.File[]): Promise<Trade> {
    const userId = user._id as string;
    let account: Account | null = null;
    const tags = this.formatTags(createTradeDto.tags);

    if (createTradeDto?.account) {
      account = await this.accountsService.findById(createTradeDto.account);
      if (account === null || !account?.isMain) {
        throw new NotFoundException();
      }
    } else {
      account = await this.accountsService.findMainAccount(user);
      if (!account) {
        throw new NotFoundException();
      }
    }

    const trade = await this.tradeModel.create({ ...createTradeDto, user: userId, account, files: [], tags });

    if (Array.isArray(files) && files.length !== 0) {
      const tradeFiles = await Promise.all(
        files.map((file) => this.uploadsService.uploadFile(file, `user-${userId}/trades/${trade?.id}`))
      );
      trade.files = tradeFiles;
      await trade.save({ validateBeforeSave: true });
    }

    return trade;
  }

  public async update(user: User, id: string, updateTradeDto: UpdateTradeDto, files: Express.Multer.File[]) {
    const userId = user._id as string;
    const trade = await this.findOneById(id);
    const tags = this.formatTags(updateTradeDto.tags);

    if (!trade) {
      throw new NotFoundException();
    }

    let updatedfiles = [...(trade?.files || [])];
    const updateData = { ...updateTradeDto };

    delete updateData.deleteFiles;

    if (updateTradeDto?.deleteFiles) {
      const files = JSON.parse(updateTradeDto.deleteFiles || '') as UploadFile[] | '';

      if (Array.isArray(files) && files.length !== 0) {
        await this.uploadsService.deleteFiles(files.map((file) => file.name));
        updatedfiles = updatedfiles.filter((file) => !files.some((f) => f?.name === file?.name));
      }
    }

    if (Array.isArray(files) && files.length !== 0) {
      const tradeFiles = await Promise.all(
        files.map((file) => this.uploadsService.uploadFile(file, `user-${userId}/trades/${trade?.id}`))
      );
      updatedfiles = [...updatedfiles, ...tradeFiles];
    }

    await this.tradeModel.updateOne({ _id: id }, { ...updateData, files: updatedfiles, tags }, { runValidators: true });
  }

  public async deleteFile(tradeId: string, name: string) {
    const trade = await this.findOneById(tradeId);
    if (!trade) {
      throw new NotFoundException();
    }

    trade.files = (trade.files || []).filter((file) => file.name !== name);
    await trade.save();
    return this.uploadsService.deleteFiles([name]);
  }

  public async delete(userId: string, id: string) {
    const trade = await this.findOneById(id);
    if (!trade) {
      throw new NotFoundException();
    }

    if (Array.isArray(trade?.files) && trade?.files.length !== 0) {
      await this.uploadsService.deleteFiles(trade?.files.map((file) => file.name));
    }

    await trade.deleteOne();
  }
}
