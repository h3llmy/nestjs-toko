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
import { DataSource, DeepPartial, QueryRunner } from 'typeorm';
import { ProductCategory } from '../product-category/entities/product-category.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderDetails } from './entities/orderDetails.entity';
import { OrderStatus } from './entities/order.entity';

describe('OrdersService', () => {
  let orderService: OrdersService;
  let orderRepository: jest.Mocked<OrderRepository>;
  let orderDetailsRepository: jest.Mocked<OrderDetailsRepository>;
  let paymentGatewayService: jest.Mocked<PaymentGatewayService>;
  let productService: jest.Mocked<ProductsService>;
  let dataSource: jest.Mocked<DataSource>;
  let queryRunner: jest.Mocked<QueryRunner>;

  const paymentOrderResponseDto: PaymentOrderResponseDto = {
    redirect_url: 'https://example.com',
    token: 'token',
  };

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
    endDate: Math.round(Date.now() / 1000) + 1000 * 60,
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
      name: 'Test Product 2',
      price: 10,
      description: 'Test Product',
      deletedAt: null,
      discounts: [],
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

  const mockSavedOrderItems: OrderDetails[] = [
    {
      id: '1',
      productName: mockProduct[0].name,
      productDescription: mockProduct[0].description,
      productPrice: mockProduct[0].price,
      category: mockProductCategory,
      categoryName: mockProductCategory.name,
      quantity: 1,
      totalPrice: 9,
      product: mockProduct[0],
      discount: mockDiscount,
      discountName: mockDiscount.name,
      discountDescription: mockDiscount.description,
      discountCode: mockDiscount.code,
      discountPercentage: mockDiscount.percentage,
      discountStartDate: mockDiscount.startDate,
      discountEndDate: mockDiscount.endDate,
    },
    {
      id: '2',
      productName: mockProduct[1].name,
      productDescription: mockProduct[1].description,
      productPrice: mockProduct[1].price,
      category: mockProductCategory,
      categoryName: mockProductCategory.name,
      quantity: 1,
      totalPrice: 10,
      product: mockProduct[1],
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

      const mockOrderCreateEntity = {
        user,
        id: '1',
        status: OrderStatus.PENDING,
        totalAmount: 19,
        createdAt: new Date(),
        deletedAt: null,
        orderDetails: mockSavedOrderItems,
      };

      const mockOrderDetailsCreateEntity: Partial<OrderDetails>[] =
        mockSavedOrderItems.map((items) => ({
          category: items.category,
          discount: items.discount,
          product: items.product,
          quantity: items.quantity,
          totalPrice: items.totalPrice,
          productDescription: items.productDescription,
          categoryName: items.categoryName,
          productName: items.productName,
          productPrice: items.productPrice,
          discountCode: items.discountCode,
          discountDescription: items.discountDescription,
          discountEndDate: items.discountEndDate,
          discountName: items.discountName,
          discountPercentage: items.discountPercentage,
          discountStartDate: items.discountStartDate,
        }));

      productService.getProductWithDiscounts.mockResolvedValue(mockProduct);

      orderDetailsRepository.createEntity.mockResolvedValue(
        mockSavedOrderItems as DeepPartial<OrderDetails>,
      );

      orderRepository.createEntity.mockResolvedValue(mockOrderCreateEntity);

      paymentGatewayService.createTransaction.mockResolvedValue(
        paymentOrderResponseDto,
      );

      const result = await orderService.create(createOrderDto, user);

      expect(result).toEqual(paymentOrderResponseDto);
      expect(dataSource.createQueryRunner).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.rollbackTransaction).not.toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
      expect(productService.save).toHaveBeenCalledWith(mockProduct, {
        session: queryRunner,
      });
      expect(productService.getProductWithDiscounts).toHaveBeenCalledWith(
        createOrderDto.orders,
      );
      expect(orderDetailsRepository.createEntity).toHaveBeenCalledWith(
        mockOrderDetailsCreateEntity,
        { session: queryRunner },
      );
      expect(orderRepository.createEntity).toHaveBeenCalledWith(
        {
          orderDetails: mockSavedOrderItems,
          user,
          totalAmount: 19,
        },
        {
          session: queryRunner,
        },
      );
      expect(paymentGatewayService.createTransaction).toHaveBeenCalledWith({
        transaction_details: {
          order_id: '1',
          gross_amount: 19,
        },
        item_details: [
          {
            id: '1',
            category: mockProductCategory.name,
            name: mockProduct[0].name,
            price: 9,
            quantity: 1,
          },
          {
            id: '2',
            category: mockProductCategory.name,
            name: mockProduct[1].name,
            price: mockProduct[1].price,
            quantity: 1,
          },
        ],
      });
    });

    it('should throw error if product not found', async () => {
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

      productService.getProductWithDiscounts.mockResolvedValue([]);

      await expect(orderService.create(createOrderDto, user)).rejects.toThrow(
        NotFoundException,
      );

      expect(dataSource.createQueryRunner).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
      expect(productService.getProductWithDiscounts).toHaveBeenCalledWith(
        createOrderDto.orders,
      );
      expect(orderDetailsRepository.createEntity).not.toHaveBeenCalled();
      expect(orderRepository.createEntity).not.toHaveBeenCalled();
      expect(paymentGatewayService.createTransaction).not.toHaveBeenCalled();
    });

    it('should throw error if discount not found', async () => {
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

      const mockProductWIthoutDiscount = mockProduct.map((product) => ({
        ...product,
        discounts: [],
      }));

      productService.getProductWithDiscounts.mockResolvedValue(
        mockProductWIthoutDiscount,
      );

      await expect(orderService.create(createOrderDto, user)).rejects.toThrow(
        NotFoundException,
      );

      expect(dataSource.createQueryRunner).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
      expect(productService.getProductWithDiscounts).toHaveBeenCalledWith(
        createOrderDto.orders,
      );
      expect(orderDetailsRepository.createEntity).not.toHaveBeenCalled();
      expect(orderRepository.createEntity).not.toHaveBeenCalled();
      expect(paymentGatewayService.createTransaction).not.toHaveBeenCalled();
    });

    it('should throw error if discount expired', async () => {
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

      const mockProductDiscountExpired = structuredClone(mockProduct);

      mockProductDiscountExpired[0].discounts[0].endDate = 1;

      productService.getProductWithDiscounts.mockResolvedValue(
        mockProductDiscountExpired,
      );

      await expect(orderService.create(createOrderDto, user)).rejects.toThrow(
        NotFoundException,
      );

      expect(dataSource.createQueryRunner).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
      expect(productService.getProductWithDiscounts).toHaveBeenCalledWith(
        createOrderDto.orders,
      );
      expect(orderDetailsRepository.createEntity).not.toHaveBeenCalled();
      expect(orderRepository.createEntity).not.toHaveBeenCalled();
      expect(paymentGatewayService.createTransaction).not.toHaveBeenCalled();
    });

    it('should throw error if product out of stock', async () => {
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

      const mockProductOutOfStock: Product[] = mockProduct.map((product) => ({
        ...product,
        inventory: {
          ...product.inventory,
          quantity: 0,
        },
      }));

      productService.getProductWithDiscounts.mockResolvedValue(
        mockProductOutOfStock,
      );

      await expect(orderService.create(createOrderDto, user)).rejects.toThrow(
        BadRequestException,
      );

      expect(dataSource.createQueryRunner).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
      expect(productService.getProductWithDiscounts).toHaveBeenCalledWith(
        createOrderDto.orders,
      );
      expect(orderDetailsRepository.createEntity).not.toHaveBeenCalled();
      expect(orderRepository.createEntity).not.toHaveBeenCalled();
      expect(paymentGatewayService.createTransaction).not.toHaveBeenCalled();
    });
  });
});
