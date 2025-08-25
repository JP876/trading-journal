import {
  PutObjectCommand,
  DeleteObjectsCommand,
  S3Client,
  waitUntilObjectNotExists,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { BadRequestException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class UploadToAwsProvider {
  private readonly s3Client: S3Client;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get('appConfig.awsAccessKeyId') as string,
        secretAccessKey: this.configService.get('appConfig.awsSecretAccessKey') as string,
      },
      region: this.configService.get('appConfig.awsRegion'),
    });
    this.bucket = this.configService.get('appConfig.awsBucketName') as string;
  }

  private generateFileName(file: Express.Multer.File) {
    const name = file.originalname.split('.')[0];
    // remove white spaces
    name.replace(/\s/g, '').trim();
    const extension = path.extname(file.originalname);
    const timestamp = new Date().getTime().toString().trim();

    return `${name}-${timestamp}-${uuid4()}${extension}`;
  }

  getFilePath(name: string) {
    return `https://${this.configService.get('appConfig.awsCloudfrontUrl')}/${name}`;
  }

  public async fileUpload(file: Express.Multer.File, folder?: string) {
    try {
      let key = this.generateFileName(file);
      if (folder) key = `${folder}/${key}`;

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });
      await this.s3Client.send(command);

      return key;
    } catch (error) {
      if (error instanceof S3ServiceException && error.name === 'EntityTooLarge') {
        throw new BadRequestException(`Error from S3 while uploading object to ${this.bucket}. \
          The object was too large. To upload objects larger than 5GB, use the S3 console (160GB max) \
          or the multipart upload API (5TB max).`);
      } else if (error instanceof S3ServiceException) {
        throw new BadRequestException(
          `Error from S3 while uploading object to ${this.bucket}. ${error.name}: ${error.message}`
        );
      }
      throw new RequestTimeoutException(error);
    }
  }

  public async deleteFiles(keys: string[]) {
    try {
      const command = new DeleteObjectsCommand({
        Bucket: this.bucket,
        Delete: { Objects: keys.map((k) => ({ Key: k })) },
      });
      const response = await this.s3Client.send(command);

      await Promise.all(
        keys.map((key) => {
          return waitUntilObjectNotExists(
            { client: this.s3Client, maxWaitTime: 60 },
            { Bucket: this.bucket, Key: key }
          );
        })
      );

      return response;
    } catch (error) {
      if (error instanceof S3ServiceException && error?.name === 'NoSuchBucket') {
        throw new BadRequestException(
          `Error from S3 while deleting objects from ${this.bucket}. The bucket doesn't exist.`
        );
      } else if (error instanceof S3ServiceException) {
        throw new BadRequestException(
          `Error from S3 while deleting objects from ${this.bucket}.  ${error.name}: ${error.message}`
        );
      }
      throw new RequestTimeoutException(error);
    }
  }
}
