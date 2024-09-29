import { ConfigService } from '@nestjs/config';
import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { FileData, IFileSaver } from 'nestjs-formdata-interceptor';

export class S3FileSaver implements IFileSaver {
  private readonly s3Client: S3Client = new S3Client({
    region: this.configService.get<string>('S3_REGION'),
    endpoint: this.configService.get<string>('S3_ENDPOINT'),
    forcePathStyle: true,
    credentials: {
      accessKeyId: this.configService.get<string>('S3_ACCESS_KEY'),
      secretAccessKey: this.configService.get<string>('S3_SECRET_KEY'),
    },
  });

  constructor(private readonly configService: ConfigService) {}

  async save(fileData: FileData) {
    const uploadParams: PutObjectCommandInput = {
      Bucket: this.configService.get<string>('S3_BUCKET'),
      Key: fileData.fileNameFull,
      Body: fileData.buffer,
      ContentType: fileData.mimetype,
    };

    const command = new PutObjectCommand(uploadParams);
    await this.s3Client.send(command);

    const s3Endpoint = await this.s3Client.config.endpoint();

    const fileUrl = `${process.env.S3_ENDPOINT}${s3Endpoint.path}${uploadParams.Bucket}/${uploadParams.Key}`;

    return fileUrl;
  }
}
