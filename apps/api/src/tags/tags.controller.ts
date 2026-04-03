import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';

import { TagsService } from './providers/tags.service';
import { CreateTagDto } from './dtos/create-tag.dto';
import { UpdateTagDto } from './dtos/update-tag.dto';
import { RequestWithUser } from 'src/auth/types';
import { GetTagsDto } from './dtos/get-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  public getTags(@Req() requset: RequestWithUser, @Query() query: GetTagsDto) {
    return this.tagsService.findTags(requset.user, query);
  }

  @Post()
  @FormDataRequest()
  public createTag(@Req() requset: RequestWithUser, @Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(requset.user, createTagDto);
  }

  @Patch(':id')
  @FormDataRequest()
  public updateTag(@Param('id') id: number, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(id, updateTagDto);
  }

  @Delete(':id')
  public deleteTag(@Param('id') id: number) {
    return this.tagsService.delete(id);
  }
}
