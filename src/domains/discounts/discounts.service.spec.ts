import { DiscountsService } from './discounts.service';
import { TestBed } from '@automock/jest';

describe('DiscountsService', () => {
  let discountService: DiscountsService;

  beforeEach(async () => {
    const { unit } = TestBed.create(DiscountsService).compile();

    discountService = unit;
  });

  it('should be defined', () => {
    expect(discountService).toBeDefined();
  });
});
