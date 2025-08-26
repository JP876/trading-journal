import { Module } from '@nestjs/common';

import { UploadsService } from './providers/uploads.service';
import { UploadToAwsProvider } from './providers/upload-to-aws.provider';

@Module({
  providers: [UploadsService, UploadToAwsProvider],
  exports: [UploadsService],
})
export class UploadsModule {}
