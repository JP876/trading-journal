import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';

import { UploadToAwsProvider } from './upload-to-aws.provider';
import { UploadFile } from '../interfaces/upload-file.interface';
import { fileTypes } from '../enums/file-types.enum';

@Injectable()
export class UploadsService {
  constructor(private readonly uploadToAwsProvider: UploadToAwsProvider) {}

  public async uploadFile(file: Express.Multer.File, folder?: string) {
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
      throw new BadRequestException('Mime type not supported');
    }

    try {
      const name = await this.uploadToAwsProvider.fileUpload(file, folder);
      const uploadFile: UploadFile = {
        name: name,
        path: this.uploadToAwsProvider.getFilePath(name),
        type: fileTypes.IMAGE,
        mime: file.mimetype,
        size: file.size,
        originalName: file.originalname,
      };

      return uploadFile;
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  public async deleteFiles(keys: string[]) {
    return await this.uploadToAwsProvider.deleteFiles(keys);
  }
}
