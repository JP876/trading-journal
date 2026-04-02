import { Injectable, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';

import { Tag } from '../tag.entity';
import { CreateTagDto } from '../dtos/create-tag.dto';
import withCatch from 'src/utils/withCatch';
import { UpdateTagDto } from '../dtos/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>
  ) {}

  private async saveTag(tag: Tag) {
    const [error, saved] = await withCatch(this.tagsRepository.save(tag));
    if (error) {
      throw new RequestTimeoutException('Unable to proccess your request at the moment. Please try later', {
        description: error.message,
      });
    }
    return saved;
  }

  public async findTags() {
    const [error, result] = await withCatch(this.tagsRepository.find());
    if (error) {
      throw new RequestTimeoutException('Unable to proccess your request at the moment. Please try later', {
        description: error.message,
      });
    }
    return result;
  }

  public async findOneBy(options: FindOptionsWhere<Tag>) {
    const [error, result] = await withCatch(this.tagsRepository.findOneBy(options));

    if (error) {
      throw new RequestTimeoutException('Unable to proccess your request at the moment. Please try later', {
        description: error.message,
        cause: error.cause,
      });
    }
    if (!result) {
      throw new NotFoundException(`The tag with options: ${JSON.stringify(options)} does not exist.`);
    }

    return result;
  }

  public async findMultipleTags(tags: number[]) {
    const [error, result] = await withCatch(this.tagsRepository.find({ where: { id: In(tags) } }));
    if (error) {
      throw new RequestTimeoutException('Unable to proccess your request at the moment. Please try later', {
        description: error.message,
      });
    }
    return result;
  }

  public async create(createTagDto: CreateTagDto) {
    const newTag = this.tagsRepository.create({ ...createTagDto });
    return await this.saveTag(newTag);
  }

  public async update(id: number, updateTagDto: UpdateTagDto) {
    const tag = await this.findOneBy({ id });

    tag.color = updateTagDto.color || tag.color;
    tag.title = updateTagDto.title || tag.title;

    return await this.saveTag(tag);
  }

  public async delete(id: number) {
    await this.findOneBy({ id });
    const [error] = await withCatch(this.tagsRepository.delete(id));

    if (error) {
      throw new RequestTimeoutException('Unable to process your request at the moment please try later');
    }
    return { id, message: 'Success' };
  }
}
