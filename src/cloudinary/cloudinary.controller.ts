import { Body, Controller, Delete, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFiles(@UploadedFiles() images: [Express.Multer.File]) {
    const uploaded_images = await Promise.all(
      images.map(async (img): Promise<{ secure_url: string; public_id: string }> => {
        const { secure_url, public_id } = await this.cloudinaryService.uploadImage(img);
        return { secure_url, public_id };
      }),
    );
    return uploaded_images;
  }

  @Delete()
  async deleteImages(@Body() public_ids: [string]) {
    await Promise.all(
      public_ids.map(async (public_id) => {
        await this.cloudinaryService.deleteImages(public_id);
      }),
    );
  }
}
