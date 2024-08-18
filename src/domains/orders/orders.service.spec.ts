import { TestBed } from '@automock/jest';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '@domains/users/entities/user.entity';
import { Product } from '@domains/products/entities/product.entity';
import { Discount } from '@domains/discounts/entities/discount.entity';
import { ProductsService } from '@domains/products/products.service';
import {
  FraudStatus,
  PaymentCheckDto,
  PaymentGatewayService,
  PaymentOrderResponseDto,
  TransactionStatus,
} from '@libs/payment-gateway';
import { OrderRepository } from './order.repository';
import { OrderDetailsRepository } from './order-details.repository';
import { DataSource, DeepPartial, QueryRunner } from 'typeorm';
import { ProductCategory } from '@domains/product-category/entities/product-category.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderDetails } from './entities/orderDetails.entity';
import { Order, OrderStatus } from './entities/order.entity';
import { IPaginationResponse } from '@libs/database';
import { PaginationOrderDto } from './dto/pagination-order.dto';
import { Role } from '@domains/roles/entities/role.entity';

describe('OrdersService', () => {
  let orderService: OrdersService;
  let orderRepository: jest.Mocked<OrderRepository>;
  let orderDetailsRepository: jest.Mocked<OrderDetailsRepository>;
  let paymentGatewayService: jest.Mocked<PaymentGatewayService>;
  let productService: jest.Mocked<ProductsService>;
  let dataSource: jest.Mocked<DataSource>;
  let queryRunner: jest.Mocked<QueryRunner>;

  const paymentOrderResponseDto: PaymentOrderResponseDto = {
    redirect_url: 'https://example.com/token',
    token: 'token',
  };

  const mockRole: Role = {
    id: '1',
    name: 'user',
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

  const mockOrder: Order = {
    id: '0d8e1e88-6c15-4aa8-ab33-2091ce62a27a',
    status: OrderStatus.PAID,
    totalAmount: 1800000,
    createdAt: new Date(),
    deletedAt: null,
    orderDetails: [mockSavedOrderItems[0]],
  };

  const mockOrderPagination: IPaginationResponse<Order> = {
    limit: 10,
    page: 1,
    totalData: 1,
    totalPages: 1,
    data: [mockOrder],
  };

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

      expect(result).toEqual({
        ...paymentOrderResponseDto,
        orderDetails: mockSavedOrderItems,
        user,
        totalAmount: 19,
        createdAt: expect.any(Date),
        deletedAt: null,
        id: '1',
        status: OrderStatus.PENDING,
      });
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

  describe('notification', () => {
    it('should update order status from payment gateway notification', async () => {
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

      const mockNotificationOrder: Order = {
        id: notificationDto.order_id,
        status: OrderStatus.PAID,
        totalAmount: 360000,
        deletedAt: null,
        createdAt: new Date(),
      };

      paymentGatewayService.paymentCheck.mockResolvedValue(notificationDto);

      orderRepository.findOne.mockResolvedValue(mockNotificationOrder);

      expect(await orderService.notification(notificationDto)).toBeUndefined();
      expect(dataSource.createQueryRunner).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(paymentGatewayService.paymentCheck).toHaveBeenCalledWith(
        notificationDto,
      );
      expect(orderRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: notificationDto.order_id,
        },
        relations: {
          orderDetails: {
            product: true,
          },
        },
      });
      expect(orderRepository.updateEntity).toHaveBeenCalledWith(
        { id: notificationDto.order_id },
        { status: OrderStatus.PAID },
        { session: queryRunner },
      );
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.rollbackTransaction).not.toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
    it('should throw error if order not found', async () => {
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

      paymentGatewayService.paymentCheck.mockResolvedValue(notificationDto);

      orderRepository.findOne.mockResolvedValue(null);

      await expect(orderService.notification(notificationDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(dataSource.createQueryRunner).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(paymentGatewayService.paymentCheck).toHaveBeenCalledWith(
        notificationDto,
      );
      expect(orderRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: notificationDto.order_id,
        },
        relations: {
          orderDetails: {
            product: true,
          },
        },
      });
      expect(orderRepository.updateEntity).not.toHaveBeenCalled();
      expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });

  describe('findPagination', () => {
    it('should find pagination', async () => {
      const findQuery: PaginationOrderDto = {
        page: 1,
        limit: 10,
      };

      orderRepository.findPagination.mockResolvedValue(mockOrderPagination);

      expect(await orderService.findPagination(findQuery, user)).toEqual(
        mockOrderPagination,
      );
      expect(orderRepository.findPagination).toHaveBeenCalledWith({
        ...findQuery,
        relations: { orderDetails: true },
        where: [
          {
            user: {
              id: user.id,
            },
          },
        ],
      });
    });
  });

  describe('findOne', () => {
    it('should find one', async () => {
      orderRepository.findOne.mockResolvedValue(mockOrder);
      expect(await orderService.findOne('1', user)).toEqual(mockOrder);

      expect(orderRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: '1',
          user: {
            id: user.id,
          },
        },
        relations: { orderDetails: true },
      });
    });
  });
});
