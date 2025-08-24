import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UploadsController } from './uploads.controller';
import { UploadsService } from './providers/uploads.service';
import { Upload, UploadSchema } from './uploads.schema';
import { UploadToAwsProvider } from './providers/upload-to-aws.provider';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService, UploadToAwsProvider],
  imports: [MongooseModule.forFeature([{ name: Upload.name, schema: UploadSchema }])],
})
export class UploadsModule {}
