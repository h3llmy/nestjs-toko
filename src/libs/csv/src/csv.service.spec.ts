import { TestBed } from '@automock/jest';
import { CsvService } from './csv.service';

describe('CsvService', () => {
  let csvService: CsvService;

  beforeEach(() => {
    const { unit } = TestBed.create(CsvService).compile();

    csvService = unit;
  });

  it('should be defined', () => {
    expect(csvService).toBeDefined();
  });

  describe('create', () => {
    it('should create csv file', () => {});
  });
});
