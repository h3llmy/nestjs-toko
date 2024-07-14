import { TestBed } from '@automock/jest';
import { DiscountsController } from './discounts.controller';
import { DiscountsService } from './discounts.service';

describe('DiscountsController', () => {
  let discountController: DiscountsController;
  let discountService: jest.Mocked<DiscountsService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(DiscountsController).compile();

    discountController = unit;
    discountService = unitRef.get(DiscountsService);
  });

  it('should be defined', () => {
    expect(discountController).toBeDefined();
    expect(discountService).toBeDefined();
  });
});
