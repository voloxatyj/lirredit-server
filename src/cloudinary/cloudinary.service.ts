import { Injectable, Logger } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private logger = new Logger(CloudinaryService.name);

  async uploadImage(
    image: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ width: 400, height: 300, crop: 'fill' }, (error, result) => {
          if (error) {
            return reject(error);
          }

          resolve(result);
        })
        .end(image.buffer);
    });
  }

  async deleteImages(public_id: string) {
    cloudinary.uploader
      .destroy(public_id, (error, result) => {
        this.logger.log(result, error);
      })
      .then(resp => this.logger.log(resp))
      .catch(err => this.logger.error(`${err}`));
  }
}
