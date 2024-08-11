import { ReportService } from './report.service';
import { TestBed } from '@automock/jest';

describe('ReportService', () => {
  let service: ReportService;

  beforeEach(() => {
    const { unit } = TestBed.create(ReportService).compile();

    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
