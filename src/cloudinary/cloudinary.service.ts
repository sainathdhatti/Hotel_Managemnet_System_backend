import { Injectable } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary.provider';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private cloudinaryProvider: CloudinaryProvider) {}

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      this.cloudinaryProvider.getCloudinary().uploader.upload_stream(
        {
          folder: 'uploads',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      ).end(file.buffer);
    });
  }
}