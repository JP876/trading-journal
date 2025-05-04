import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

import { CloudinaryResponse } from './cloudinary-reponse';

type uploadOptionsType = {
  folder?: string;
};

@Injectable()
export class CloudinaryService {
  public uploadFile(
    file: Express.Multer.File,
    userId: string,
    options?: uploadOptionsType
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const defaultFolder = `trading-journal/${userId}`;
      const newFolder = options?.folder ? `${defaultFolder}/${options?.folder}` : defaultFolder;

      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: newFolder, use_filename: true, image_metadata: true, resource_type: 'image' },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(new Error(error.message));
          resolve(result);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  public deleteFile(id: string) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(id, (error: any, response: any) => {
        if (error) return reject(new Error(''));
        resolve(response);
      });
    });
  }

  public deleteFolderWithAssets(userId: string, folderName: string) {
    const folder = `trading-journal/${userId}/${folderName}`;

    return new Promise((resolve, reject) => {
      cloudinary.api.delete_all_resources({ prefix: folder }, (error: any) => {
        if (error) return reject(new Error(''));

        cloudinary.api.delete_folder(folder, (error: any, response: any) => {
          if (error) return reject(new Error(''));
          resolve(response);
        });
      });
    });
  }
}
