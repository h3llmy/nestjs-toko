import { TestBed } from '@automock/jest';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let orderService: OrdersService;

  beforeEach(async () => {
    const { unit } = TestBed.create(OrdersService).compile();

    orderService = unit;
  });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
  });
});
