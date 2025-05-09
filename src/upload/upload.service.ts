import {
  AbortMultipartUploadCommand,
  CompletedPart,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly s3: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: 'us-east-1',
      endpoint: 'http://minio:9000', // neu dung pre signed url o local thi doi minio -> localhost
      credentials: {
        accessKeyId: this.configService.get<string>('minio.access_key') ?? '',
        secretAccessKey:
          this.configService.get<string>('minio.secret_key') ?? '',
      },
      forcePathStyle: true, // Bắt buộc cho MinIO
    });
  }

  async uploadFile(
    fileBuffer: Buffer,
    filename: string,
    mimetype: string,
  ): Promise<string> {
    try {
      const params: PutObjectCommandInput = {
        Bucket: this.configService.get<string>('minio.bucket') ?? '',
        Key: filename,
        Body: fileBuffer,
        ContentType: mimetype,
      };

      await this.s3.send(new PutObjectCommand(params));

      return `http://minio:9000/my-bucket/${filename}`;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async uploadFileMultipart(
    fileBuffer: Buffer,
    filename: string,
    mimetype: string,
  ): Promise<string> {
    const bucket = this.configService.get<string>('minio.bucket') ?? '';
    const partSize = 5 * 1024 * 1024; // 5MB
    const totalParts = Math.ceil(fileBuffer.length / partSize);

    const createCommand = new CreateMultipartUploadCommand({
      Bucket: bucket,
      Key: filename,
      ContentType: mimetype,
    });

    const { UploadId } = await this.s3.send(createCommand);

    const completedParts: CompletedPart[] = [];

    try {
      for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
        const start = (partNumber - 1) * partSize;
        const end = Math.min(start + partSize, fileBuffer.length);

        const partBuffer = fileBuffer.slice(start, end);

        let attempt = 0;
        let success = false;
        let etag: string | undefined;

        while (attempt < 3 && !success) {
          try {
            const uploadPartCommand = new UploadPartCommand({
              Bucket: bucket,
              Key: filename,
              PartNumber: partNumber,
              UploadId,
              Body: partBuffer,
            });

            const response = await this.s3.send(uploadPartCommand);
            etag = response.ETag!;
            success = true;
          } catch (error) {
            attempt++;
            console.warn(
              `❌ Failed part ${partNumber}, attempt ${attempt}:`,
              error,
            );

            if (attempt === 3)
              throw new Error(
                `Failed to upload part ${partNumber} after 3 attempts`,
              );
          }
        }

        completedParts.push({
          ETag: etag!,
          PartNumber: partNumber,
        });

        console.log(`Uploaded part ${partNumber}/${totalParts}`);
      }

      const completeCommand = new CompleteMultipartUploadCommand({
        Bucket: bucket,
        Key: filename,
        UploadId,
        MultipartUpload: { Parts: completedParts },
      });

      await this.s3.send(completeCommand);
      return `http://minio:9000/${bucket}/${filename}`;
    } catch (err) {
      console.error('❌ Upload failed, aborting...', err);

      await this.s3.send(
        new AbortMultipartUploadCommand({
          Bucket: bucket,
          Key: filename,
          UploadId,
        }),
      );

      throw err;
    }
  }

  async generatePresignedUrl(
    filename: string,
    mimetype: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.configService.get<string>('minio.bucket') ?? '',
      Key: filename,
      ContentType: mimetype,
    });

    try {
      // Tạo presigned URL
      const url = await getSignedUrl(this.s3, command, {
        expiresIn: 3600, // Thời gian URL có hiệu lực (ví dụ: 1 giờ)
      });
      return url;
    } catch (error) {
      console.error('Error generating presigned URL', error);
      throw error;
    }
  }
}
