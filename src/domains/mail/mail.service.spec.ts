import { TestBed } from '@automock/jest';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { User } from '@domains/users/entities/user.entity';
import { Role } from '@domains/roles/entities/role.entity';
import { SentMessageInfo } from 'nodemailer';
import { Order, OrderStatus } from '@domains/orders/entities/order.entity';
import { OrderDetails } from '@domains/orders/entities/orderDetails.entity';
import { Product } from '@domains/products/entities/product.entity';
import { ProductCategory } from '@domains/product-category/entities/product-category.entity';
import { Discount } from '@domains/discounts/entities/discount.entity';

describe('MailService', () => {
  let service: MailService;
  let mailerService: jest.Mocked<MailerService>;
  let configService: jest.Mocked<ConfigService>;

  const mockRole: Role = {
    id: '1',
    name: 'admin',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockUser: User = {
    id: '1',
    username: 'Test User',
    email: 'test@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    emailVerifiedAt: Date.now(),
    password: 'some hashed password',
    role: mockRole,
  };

  const mockProduct: Product = {
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

  const mockProductCategory: ProductCategory = {
    id: '1',
    name: 'category 1',
    createdAt: new Date(),
    updatedAt: new Date(),
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

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(MailService)
      .mock(ConfigService)
      .using({
        get: jest.fn().mockImplementation((key: string) => {
          if (key === 'WEB_URL') {
            return 'http://localhost:3000';
          }
          if (key === 'WEB_VERIFY_ROUTE') {
            return 'auth/verify';
          }
          if (key === 'WEB_FORGET_PASSWORD_ROUTE') {
            return 'auth/forget-password';
          }
        }),
      })
      .compile();

    service = unit;
    mailerService = unitRef.get(MailerService);
    configService = unitRef.get(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mailerService).toBeDefined();
    expect(configService).toBeDefined();
  });

  describe('sendRegisterMail', () => {
    it('should be defined', () => {
      expect(service.sendRegisterMail).toBeDefined();
    });

    it('should send an verification email', async () => {
      mailerService.sendMail.mockResolvedValue({} as SentMessageInfo);
      const result = await service.sendRegisterMail(mockUser, 'token');
      const confirmationLink = 'http://localhost:3000/auth/verify/token';
      expect(result).toEqual({});
      expect(mailerService.sendMail).toHaveBeenCalledWith({
        template: 'basic-auth/register',
        to: mockUser.email,
        subject: 'Registration Email',
        context: {
          confirmationLink,
          user: mockUser,
        },
      });
    });
  });

  describe('sendForgetPasswordMail', () => {
    it('should be defined', () => {
      expect(service.sendForgetPasswordMail).toBeDefined();
    });

    it('should send an forget password email', async () => {
      mailerService.sendMail.mockResolvedValue({} as SentMessageInfo);
      const result = await service.sendForgetPasswordMail(mockUser, 'token');
      const forgetPasswordLink =
        'http://localhost:3000/auth/forget-password/token';
      expect(result).toEqual({});
      expect(mailerService.sendMail).toHaveBeenCalledWith({
        template: 'basic-auth/forget-password',
        to: mockUser.email,
        subject: 'Forget Password',
        context: {
          forgetPasswordLink,
          user: mockUser,
        },
      });
    });
  });

  describe('sendCreateOrderMail', () => {
    it('should be defined', () => {
      expect(service.sendCreateOrderMail).toBeDefined();
    });

    it('should send an order creation email', async () => {
      mailerService.sendMail.mockResolvedValue({} as SentMessageInfo);
      const result = await service.sendCreateOrderMail(mockUser, mockOrder);
      expect(result).toEqual({});
      expect(mailerService.sendMail).toHaveBeenCalledWith({
        template: 'order/order-created',
        to: mockUser.email,
        subject: 'Create Order',
        context: {
          user: mockUser,
          order: mockOrder,
        },
      });
    });
  });
});
