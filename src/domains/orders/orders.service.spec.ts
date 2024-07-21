import { TestBed } from '@automock/jest';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Role, User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Discount } from '../discounts/entities/discount.entity';
import { ProductsService } from '../products/products.service';
import {
  PaymentGatewayService,
  PaymentOrderResponseDto,
} from '@app/payment-gateway';
import { OrderRepository } from './order.repository';
import { OrderDetailsRepository } from './order-details.repository';
import { DataSource, In, QueryRunner } from 'typeorm';
import { ProductCategory } from '../product-category/entities/product-category.entity';
import { NotFoundException } from '@nestjs/common';
import { OrderDetails } from './entities/orderDetails.entity';

describe('OrdersService', () => {
  let orderService: OrdersService;
  let orderRepository: jest.Mocked<OrderRepository>;
  let orderDetailsRepository: jest.Mocked<OrderDetailsRepository>;
  let paymentGatewayService: jest.Mocked<PaymentGatewayService>;
  let productService: jest.Mocked<ProductsService>;
  let dataSource: jest.Mocked<DataSource>;
  let queryRunner: jest.Mocked<QueryRunner>;

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
    endDate: 1,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockProduct: Product[] = [
    {
      id: '1',
      name: 'Test Product',
      price: 10,
      description: 'Test Product',
      deletedAt: null,
      discounts: [mockDiscount],
      inventory: {
        id: '1',
        quantity: 10,
        updatedAt: new Date(),
      },
      category: mockProductCategory,
      updatedAt: new Date(),
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Test Product',
      price: 10,
      description: 'Test Product',
      deletedAt: null,
      inventory: {
        id: '2',
        quantity: 10,
        updatedAt: new Date(),
      },
      category: mockProductCategory,
      updatedAt: new Date(),
      createdAt: new Date(),
    },
  ];

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(OrdersService).compile();

    orderService = unit;
    productService = unitRef.get<ProductsService>(ProductsService);
    orderRepository = unitRef.get<OrderRepository>(OrderRepository);
    orderDetailsRepository = unitRef.get<OrderDetailsRepository>(
      OrderDetailsRepository,
    );
    paymentGatewayService = unitRef.get<PaymentGatewayService>(
      PaymentGatewayService,
    );
    dataSource = unitRef.get<DataSource>(DataSource);

    queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        getRepository: jest.fn(),
      },
    } as unknown as jest.Mocked<QueryRunner>;

    dataSource.createQueryRunner = jest.fn().mockReturnValue(queryRunner);
  });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
    expect(productService).toBeDefined();
    expect(orderRepository).toBeDefined();
    expect(orderDetailsRepository).toBeDefined();
    expect(paymentGatewayService).toBeDefined();
    expect(dataSource).toBeDefined();
  });

  // TODO fix this test
  describe('create', () => {
    it('should create new order successfully', async () => {
      const mockCreateOrderDto: CreateOrderDto = {
        orders: [
          {
            productId: '1',
            quantity: 1,
          },
          {
            productId: '2',
            quantity: 1,
          },
        ],
      };

      // const mockOrderDetail: OrderDetails = {
      //   id: '1',
      //   product: mockProduct[0],
      //   quantity: 1,
      //   order: new Order(),
      //   productName: '',
      //   productDescription: '',
      //   productPrice: 0,
      //   category: new ProductCategory(),
      //   categoryName: '',
      //   totalPrice: 0,
      // };

      const mockPaymentOrderResponseDto: PaymentOrderResponseDto = {
        token: 'test',
        redirect_url: 'test',
      };

      productService.findMany.mockResolvedValue(mockProduct);
      orderDetailsRepository.createEntity.mockResolvedValue([{}] as any);
      orderRepository.createEntity.mockResolvedValue({
        id: '1',
        orderDetails: [{}],
        totalAmount: 20,
      });
      paymentGatewayService.createTransaction.mockResolvedValue(
        mockPaymentOrderResponseDto,
      );

      const result = await orderService.create(mockCreateOrderDto, user);

      expect(result).toBeDefined();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should throw NotFoundException when some products are not found', async () => {
      const mockCreateOrderDto: CreateOrderDto = {
        orders: [
          {
            productId: '1',
            quantity: 1,
          },
          {
            productId: '3',
            quantity: 1,
          },
        ],
      };

      productService.findMany.mockResolvedValue(mockProduct);

      await expect(
        orderService.create(mockCreateOrderDto, user),
      ).rejects.toThrow(NotFoundException);
      expect(productService.findMany).toHaveBeenCalledWith({
        where: {
          id: In(mockCreateOrderDto.orders.map((order) => order.productId)),
        },
        relations: { category: true, discounts: true, inventory: true },
      });
      expect(dataSource.createQueryRunner).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();

      expect(orderDetailsRepository.createEntity).not.toHaveBeenCalled();
      expect(orderRepository.createEntity).not.toHaveBeenCalled();
      expect(paymentGatewayService.createTransaction).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when discount is not valid', async () => {
      const mockCreateOrderDto: CreateOrderDto = {
        orders: [
          {
            productId: '1',
            quantity: 1,
            discountId: '1',
          },
        ],
      };

      const expiredDiscountProduct = {
        ...mockProduct[0],
        discounts: [
          {
            ...mockDiscount,
            startDate: Date.now() / 1000 - 1000,
            endDate: Date.now() / 1000 - 500,
          },
        ],
      };

      productService.findMany.mockResolvedValue([expiredDiscountProduct]);

      await expect(
        orderService.create(mockCreateOrderDto, user),
      ).rejects.toThrow(NotFoundException);
      expect(productService.findMany).toHaveBeenCalledWith({
        where: {
          id: In(mockCreateOrderDto.orders.map((order) => order.productId)),
        },
        relations: { category: true, discounts: true, inventory: true },
      });
      expect(dataSource.createQueryRunner).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();

      expect(orderDetailsRepository.createEntity).not.toHaveBeenCalled();
      expect(orderRepository.createEntity).not.toHaveBeenCalled();
      expect(paymentGatewayService.createTransaction).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when not enough product in stock', async () => {
      const mockCreateOrderDto: CreateOrderDto = {
        orders: [
          {
            productId: '1',
            quantity: 11,
          },
        ],
      };

      productService.findMany.mockResolvedValue(mockProduct);

      await expect(
        orderService.create(mockCreateOrderDto, user),
      ).rejects.toThrow(NotFoundException);
      expect(productService.findMany).toHaveBeenCalledWith({
        where: {
          id: In(mockCreateOrderDto.orders.map((order) => order.productId)),
        },
        relations: { category: true, discounts: true, inventory: true },
      });
      expect(dataSource.createQueryRunner).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();

      expect(orderDetailsRepository.createEntity).not.toHaveBeenCalled();
      expect(orderRepository.createEntity).not.toHaveBeenCalled();
      expect(paymentGatewayService.createTransaction).not.toHaveBeenCalled();
    });
  });
});
