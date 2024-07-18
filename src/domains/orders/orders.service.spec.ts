import { TestBed } from '@automock/jest';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Role, User } from '../users/entities/user.entity';

describe('OrdersService', () => {
  let orderService: OrdersService;

  const user: User = {
    id: '1',
    username: 'test',
    email: 'test',
    password: 'test',
    createdAt: new Date(),
    emailVerifiedAt: Date.now(),
    role: Role.USER,
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const { unit } = TestBed.create(OrdersService).compile();

    orderService = unit;
  });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
  });

  describe('create', () => {
    it('should create new order', async () => {
      const mockCreateOrderDto: CreateOrderDto = {
        orders: [
          {
            productId: '1',
            quantity: 1,
          },
        ],
      };

      const result = await orderService.create(mockCreateOrderDto, user);

      expect(result).toBeDefined();
    });
  });
});
