import { Module } from '@nestjs/common';
import { CsvService } from './csv.service';

@Module({
  providers: [CsvService],
  exports: [CsvService],
})
export class CsvModule {}
