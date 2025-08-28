import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';

import { TagsService } from './providers/tags.service';
import RequestWithUser from 'src/auth/interfaces/request-with-user.interface';
import ParamsWithId from 'src/utils/params-with-id';
import { CreateTagDto } from './dtos/create-tag.dto';
import { UpdateTagDto } from './dtos/update-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  public getTags(@Req() request: RequestWithUser) {
    return this.tagsService.findAll(request.user);
  }

  @Get(':id')
  public getTagById(@Param() { id }: ParamsWithId) {
    return this.tagsService.findById(id);
  }

  @Post()
  public createTag(@Req() request: RequestWithUser, @Body() createDto: CreateTagDto) {
    return this.tagsService.create(createDto, request.user);
  }

  @Patch(':id')
  public async updateTag(@Param() { id }: ParamsWithId, @Body() updateDto: UpdateTagDto) {
    return await this.tagsService.update(id, updateDto);
  }

  @Delete(':id')
  public async deleteTag(@Param() { id }: ParamsWithId) {
    return await this.tagsService.delete(id);
  }
}
