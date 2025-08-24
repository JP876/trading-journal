import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

import { UploadsService } from './providers/uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadService: UploadsService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('file')
  public uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadFile(file);
  }
}
