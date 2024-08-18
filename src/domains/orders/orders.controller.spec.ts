import { TestBed } from '@automock/jest';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '@domains/users/entities/user.entity';
import {
  FraudStatus,
  PaymentCheckDto,
  PaymentOrderResponseDto,
  TransactionStatus,
} from '@libs/payment-gateway';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderDetails } from './entities/orderDetails.entity';
import { ProductCategory } from '@domains/product-category/entities/product-category.entity';
import { Discount } from '@domains/discounts/entities/discount.entity';
import { IPaginationResponse } from '@libs/database';
import { Role } from '@domains/roles/entities/role.entity';
import { MailService } from '@domains/mail/mail.service';

describe('OrdersController', () => {
  let orderController: OrdersController;
  let orderService: jest.Mocked<OrdersService>;
  let mailService: jest.Mocked<MailService>;

  const mockRole: Role = {
    id: '1',
    name: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const user: User = {
    id: '1',
    username: 'test',
    email: 'test',
    password: 'test',
    createdAt: new Date(),
    emailVerifiedAt: Date.now(),
    role: mockRole,
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockProductCategory: ProductCategory = {
    id: '1',
    name: 'category 1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockDiscount: Discount = {
    id: '1',
    code: 'test',
    description: 'test',
    name: 'test',
    percentage: 10,
    startDate: 1,
    endDate: Math.round(Date.now() / 1000) + 1000 * 60,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 10,
    description: 'Test Product',
    deletedAt: null,
    inventory: {
      id: '1',
      quantity: 10,
      updatedAt: new Date(),
    },
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  const mockOrderDetail: OrderDetails = {
    id: '1',
    productName: mockProduct.name,
    productDescription: mockProduct.description,
    productPrice: mockProduct.price,
    category: mockProductCategory,
    categoryName: mockProductCategory.name,
    quantity: 1,
    totalPrice: 9,
    product: mockProduct,
    discount: mockDiscount,
    discountName: mockDiscount.name,
    discountDescription: mockDiscount.description,
    discountCode: mockDiscount.code,
    discountPercentage: mockDiscount.percentage,
    discountStartDate: mockDiscount.startDate,
    discountEndDate: mockDiscount.endDate,
  };

  const mockOrder: Order = {
    id: '0d8e1e88-6c15-4aa8-ab33-2091ce62a27a',
    status: OrderStatus.PAID,
    totalAmount: 1800000,
    createdAt: new Date(),
    deletedAt: null,
    orderDetails: [mockOrderDetail],
  };

  const mockPaginationOrder: IPaginationResponse<Order> = {
    data: [mockOrder],
    limit: 10,
    page: 1,
    totalData: 1,
    totalPages: 1,
  };

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(OrdersController).compile();

    orderController = unit;
    orderService = unitRef.get<OrdersService>(OrdersService);
    mailService = unitRef.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(orderController).toBeDefined();
    expect(orderService).toBeDefined();
    expect(mailService).toBeDefined();
  });

  describe('create', () => {
    it('should create an order', async () => {
      const createOrderDto: CreateOrderDto = {
        orders: [
          {
            productId: '1',
            discountId: '1',
            quantity: 1,
          },
          {
            productId: '2',
            quantity: 1,
          },
        ],
      };

      const paymentOrderResponseDto: PaymentOrderResponseDto = {
        redirect_url: 'https://example.com/token',
        token: 'token',
      };
      orderService.create.mockResolvedValue({
        ...paymentOrderResponseDto,
        ...mockOrder,
      });
      mailService.sendCreateOrderMail.mockResolvedValue(undefined);

      const response = await orderController.create(createOrderDto, user);

      expect(response).toEqual(paymentOrderResponseDto);
      expect(orderService.create).toHaveBeenCalledWith(createOrderDto, user);
      expect(mailService.sendCreateOrderMail).toHaveBeenCalledWith(user, {
        ...mockOrder,
      });
    });
  });

  describe('notification', () => {
    it('should be defined', () => {
      expect(orderController.notification).toBeDefined();
    });

    it('should get notification', async () => {
      const notificationDto: PaymentCheckDto = {
        status_code: '200',
        transaction_id: '74507653-d8eb-4ced-8975-3b77ec18db26',
        gross_amount: '360000.00',
        currency: 'IDR',
        order_id: '492bb619-ddfd-4ca6-a9ef-4564e8b0b785',
        payment_type: 'bank_transfer',
        signature_key:
          '0ad103e43ff6e84bd44c7c8d1ae6f9010d69f92c68b0e145afb6695e89fb3b683154312aefd5e665ef8b6b36789a69419831b13a23bc93ec80802a6c36fdea51',
        transaction_status: TransactionStatus.SETTLEMENT,
        fraud_status: FraudStatus.ACCEPT,
        status_message: 'Success, transaction is found',
        merchant_id: 'G444672650',
        transaction_time: '2024-07-27 20:29:51',
        settlement_time: '2024-07-27 20:29:56',
      };
      orderService.notification.mockResolvedValue();
      const response = await orderController.notification(notificationDto);
      expect(orderService.notification).toHaveBeenCalledWith(notificationDto);
      expect(response).toEqual({
        message: 'success',
      });
    });
  });

  describe('findPagination', () => {
    it('should be defined', () => {
      expect(orderController.findPagination).toBeDefined();
    });

    it('should get list orders with pagination', async () => {
      orderService.findPagination.mockResolvedValue(mockPaginationOrder);
      const paginationOption = {
        page: 1,
        limit: 10,
      };
      const orders = await orderController.findPagination(
        paginationOption,
        user,
      );
      expect(orderService.findPagination).toHaveBeenCalledWith(
        paginationOption,
        user,
      );
      expect(orders).toEqual(mockPaginationOrder);
    });
  });

  describe('findOne', () => {
    it('should be defined', () => {
      expect(orderController.findOne).toBeDefined();
    });

    it('should get a order by id', async () => {
      orderService.findOne.mockResolvedValue(mockOrder);
      const order = await orderController.findOne('1', user);
      expect(orderService.findOne).toHaveBeenCalledWith('1', user);
      expect(order).toEqual(mockOrder);
    });
  });
});
