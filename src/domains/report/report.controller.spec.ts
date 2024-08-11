import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { TestBed } from '@automock/jest';

describe('ReportController', () => {
  let reportController: ReportController;
  let reportService: ReportService;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(ReportController).compile();

    reportController = unit;
    reportService = unitRef.get(ReportService);
  });

  it('should be defined', () => {
    expect(reportController).toBeDefined();
    expect(reportService).toBeDefined();
  });
});
