import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TagsController } from './tags.controller';
import { TagsService } from './providers/tags.service';
import { Tag } from './tag.entity';
import { PaginationModule } from 'src/common/pagination/pagination.module';

@Module({
  controllers: [TagsController],
  providers: [TagsService],
  imports: [TypeOrmModule.forFeature([Tag]), PaginationModule],
  exports: [TagsService],
})
export class TagsModule {}
