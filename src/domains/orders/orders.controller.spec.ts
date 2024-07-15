import { TestBed } from '@automock/jest';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
  let orderController: OrdersController;
  let orderService: jest.Mocked<OrdersService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(OrdersController).compile();

    orderController = unit;
    orderService = unitRef.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(orderController).toBeDefined();
    expect(orderService).toBeDefined();
  });
});
