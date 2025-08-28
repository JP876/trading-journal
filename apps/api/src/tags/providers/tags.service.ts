import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Tag } from '../tag.schema';
import { User } from 'src/user/user.schema';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { UpdateTagDto } from '../dtos/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private readonly tagModel: Model<Tag>) {}

  public async findAll(user: User): Promise<Tag[] | null> {
    const tags = await this.tagModel.find({ user: user.id });
    return tags;
  }

  public async findById(id: string): Promise<Tag | null> {
    const result = await this.tagModel.findById(id);
    return result;
  }

  public async create(createTagDto: CreateTagDto, user: User): Promise<Tag | null> {
    const created = await this.tagModel.create({ ...createTagDto, user: user._id });
    return created;
  }

  public async update(id: string, updateTagDto: UpdateTagDto): Promise<Tag | null> {
    const updated = await this.tagModel.findByIdAndUpdate(
      id,
      { ...updateTagDto },
      { runValidators: true, returnDocument: 'after' }
    );
    return updated;
  }

  public async delete(id: string) {
    return await this.tagModel.findByIdAndDelete(id);
  }
}
