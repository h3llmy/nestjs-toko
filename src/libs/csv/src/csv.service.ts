import { Injectable } from '@nestjs/common';
import fs from 'fs';
import { ReadStream } from 'typeorm/platform/PlatformTools';
import { PREFIX_FILE_PATH } from './config/csv.config';
import path from 'path';

@Injectable()
export class CsvService {
  private FULL_PATH: string;

  createFromStream(filePath: string, readStream: ReadStream): Promise<string> {
    return new Promise<string>((resolve, rejects) => {
      let csvPath: string;
      readStream.on('data', (chunk: Record<string, any>) => {
        csvPath = this.create(filePath, chunk);
      });

      readStream.on('end', () => {
        resolve(csvPath);
      });

      readStream.on('error', (error) => {
        rejects(error);
      });
    });
  }

  create(filePath: string, csvData: Record<string, string | number>): string {
    this.FULL_PATH = `${PREFIX_FILE_PATH}/${filePath}.csv`;
    const isFileExist = this.checkFileExist(this.FULL_PATH);
    const dataRow = this.getDataRow(csvData);
    if (!isFileExist) {
      this.ensureDirectoryExists(this.FULL_PATH);

      const headers = this.getHeaders(csvData);
      fs.writeFileSync(this.FULL_PATH, `${headers}\n${dataRow}`, {
        encoding: 'utf-8',
        flag: 'a+',
      });
    } else {
      fs.appendFileSync(this.FULL_PATH, `\n${dataRow}`, {
        encoding: 'utf-8',
      });
    }
    return this.FULL_PATH;
  }

  private ensureDirectoryExists(filePath: string): void {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private checkFileExist(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  private getHeaders(csvData: Record<string, string | number>): string {
    return Object.keys(csvData).join(';');
  }

  private getDataRow(csvData: Record<string, string | number>): string {
    return Object.values(csvData).join(';');
  }
}
