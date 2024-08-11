import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { CsvModule } from '@libs/csv';
import { OrdersModule } from '@domains/orders/orders.module';
import { RandomizeModule } from '@libs/randomize';

@Module({
  imports: [CsvModule, OrdersModule, RandomizeModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
