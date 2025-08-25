import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from '../user.schema';
import { CreateUserDto } from '../dtos/create-user-dto';
import { UpdateUserDto } from '../dtos/update-user-dto';
import { AccountsService } from 'src/accounts/providers/accounts.service';
import { UploadsService } from 'src/uploads/providers/uploads.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly accountsService: AccountsService,
    private readonly uploadsService: UploadsService
  ) {}

  public async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    return user ? user : null;
  }

  public async findUserById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id);
    return user ? user : null;
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findUserByEmail(createUserDto.email);

    if (user?.email === createUserDto.email) {
      throw new BadRequestException('The user already exists, please check your email.');
    }

    const created = await this.userModel.create(createUserDto);
    await this.accountsService.create({ title: 'Demo', isMain: true }, created);
    return created;
  }

  public async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException();
    }

    const updateData = { ...updateUserDto, userSettings: { ...user?.userSettings, ...updateUserDto?.userSettings } };
    await this.userModel.updateOne({ _id: id }, updateData);
  }

  public async updateAvatar(id: string, avatar: Express.Multer.File) {
    try {
      const user = await this.findUserById(id);
      if (!user) {
        throw new NotFoundException();
      }

      if (user?.avatar?.name) {
        await this.uploadsService.deleteFiles([user.avatar.name]);
      }

      const file = await this.uploadsService.uploadFile(avatar, `user-${user.id}/profile`);
      await this.userModel.updateOne({ _id: id }, { avatar: file });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
