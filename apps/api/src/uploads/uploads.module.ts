import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UploadsService } from './providers/uploads.service';
import { Upload, UploadSchema } from './uploads.schema';
import { UploadToAwsProvider } from './providers/upload-to-aws.provider';

@Module({
  providers: [UploadsService, UploadToAwsProvider],
  imports: [MongooseModule.forFeature([{ name: Upload.name, schema: UploadSchema }])],
  exports: [UploadsService],
})
export class UploadsModule {}
