import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Upload } from '../uploads.schema';
import { UploadToAwsProvider } from './upload-to-aws.provider';
import { UploadFile } from '../interfaces/upload-file.interface';
import { fileTypes } from '../enums/file-types.enum';

@Injectable()
export class UploadsService {
  constructor(
    @InjectModel(Upload.name) private readonly uploadModel: Model<Upload>,
    private readonly uploadToAwsProvider: UploadToAwsProvider,
    private readonly configService: ConfigService
  ) {}

  public async uploadFile(file: Express.Multer.File) {
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
      throw new BadRequestException('Mime type not supported');
    }

    try {
      const name = await this.uploadToAwsProvider.fileUpload(file);
      const uploadFile: UploadFile = {
        name: name,
        path: `https://${this.configService.get('appConfig.awsCloudfrontUrl')}/${name}`,
        type: fileTypes.IMAGE,
        mime: file.mimetype,
        size: file.size,
      };

      const upload = await this.uploadModel.create(uploadFile);
      return upload;
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
