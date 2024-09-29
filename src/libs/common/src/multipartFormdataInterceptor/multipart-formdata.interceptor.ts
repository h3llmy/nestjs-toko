import { ConfigService } from '@nestjs/config';
import { FormdataInterceptor } from 'nestjs-formdata-interceptor';
import { S3FileSaver } from '@libs/common';

export class MultipartFormDataInterceptor extends FormdataInterceptor {
  constructor(configService: ConfigService) {
    super({
      customFileName(context, originalFileName) {
        return `${Date.now()}-${originalFileName}`;
      },
      fileSaver: new S3FileSaver(configService),
    });
  }
}
