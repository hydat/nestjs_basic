import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const { buffer, originalname, mimetype } = file;
      const url = await this.uploadService.uploadFileMultipart(
        buffer,
        originalname,
        mimetype,
      );
      return { url };
    } catch (error) {
      throw new Error(error);
    }
  }

  @Post('/presigned-url')
  @UseInterceptors(FileInterceptor('file'))
  async presignedUrl(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    try {
      const { originalname, mimetype } = file;
      console.log(originalname, mimetype);
      return await this.uploadService.generatePresignedUrl(
        originalname,
        mimetype,
      );
    } catch (error) {
      throw new Error(error);
    }
  }
}
