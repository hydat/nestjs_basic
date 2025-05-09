import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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

  @Post('/parallel')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Thư mục lưu file tạm
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async parallelUpload(@UploadedFile() file: Express.Multer.File) {
    try {
      const { originalname, path, mimetype } = file;
      console.log(file);
      await this.uploadService.parallelUpload(originalname, path, mimetype);
    } catch (error) {
      throw new Error(error);
    }
  }
}
