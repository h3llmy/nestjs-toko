import { OrdersService } from '@domains/orders/orders.service';
import { Injectable } from '@nestjs/common';
import { CsvService } from '@libs/csv';
import { RandomizeService } from '@libs/randomize';

@Injectable()
export class ReportService {
  constructor(
    private readonly csvService: CsvService,
    private readonly orderService: OrdersService,
    private readonly randomizeService: RandomizeService,
  ) {}

  async createReport(): Promise<string | null> {
    const stream = await this.orderService.findReadableStream();
    return new Promise<string>((resolve, rejects) => {
      const reportPath = `report-${this.randomizeService.stringNumber(10)}-${Date.now()}`;
      let csvPath: string;
      stream.on('data', (chunk: Record<string, any>) => {
        csvPath = this.csvService.create(reportPath, {
          id: chunk.orders_id,
          status: chunk.orders_status,
          username: chunk.user_username,
          email: chunk.user_email,
        });
      });

      stream.on('end', () => {
        resolve(csvPath);
      });

      stream.on('error', (error) => {
        rejects(error);
      });
    });
  }
}
