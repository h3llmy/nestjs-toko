import { FileData } from 'nestjs-formdata-interceptor';

export type S3FileData = FileData<Promise<string>, string>;
