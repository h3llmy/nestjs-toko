import { Controller, NotFoundException, Post } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from '@libs/common';

@ApiTags('Report')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('create-report')
  @Permission('create report')
  async createReport() {
    const csvPath = await this.reportService.createReport();
    if (!csvPath) {
      throw new NotFoundException('Order not found');
    }
    return csvPath;
  }
}
