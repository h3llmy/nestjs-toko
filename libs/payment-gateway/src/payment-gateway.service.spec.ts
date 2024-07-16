import { TestBed } from '@automock/jest';
import { PaymentGatewayService } from './payment-gateway.service';
import { CreatePaymentTransaction } from './dto/create-payment-transaction.dto';
import midtrans from 'midtrans-client';
import { ServiceUnavailableException } from '@nestjs/common';

jest.mock('midtrans-client');

describe('PaymentGatewayService', () => {
  let service: PaymentGatewayService;
  let midtransClientMock: any;

  beforeEach(() => {
    midtransClientMock = {
      createTransaction: jest.fn(),
      notification: jest.fn(),
    };

    (midtrans.Snap as jest.Mock).mockImplementation(() => midtransClientMock);

    const { unit } = TestBed.create(PaymentGatewayService).compile();

    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should create new payment transaction', async () => {
      const mockCreatePaymentTransaction: CreatePaymentTransaction = {
        transaction_details: {
          order_id: '1',
          gross_amount: 10000,
        },
      };

      midtransClientMock.createTransaction.mockResolvedValue({
        redirect_url: 'http://redirect-url',
        token: 'transaction-id',
      });

      const result = await service.createTransaction(
        mockCreatePaymentTransaction,
      );

      expect(result).toBeDefined();
      expect(result.redirect_url).toBe('http://redirect-url');
      expect(result.token).toBe('transaction-id');
      expect(midtransClientMock.createTransaction).toHaveBeenCalledWith(
        mockCreatePaymentTransaction,
      );
    });

    it('should throw an service unavailable exception if transaction creation fails', async () => {
      const mockCreatePaymentTransaction: CreatePaymentTransaction = {
        transaction_details: {
          order_id: '1',
          gross_amount: 10000,
        },
      };

      midtransClientMock.createTransaction.mockRejectedValue(new Error());

      await expect(
        service.createTransaction(mockCreatePaymentTransaction),
      ).rejects.toThrow(ServiceUnavailableException);
    });

    it('should throw an service unavailable exception if transaction creation return null', async () => {
      const mockCreatePaymentTransaction: CreatePaymentTransaction = {
        transaction_details: {
          order_id: '1',
          gross_amount: 10000,
        },
      };

      midtransClientMock.createTransaction.mockResolvedValue(null);

      await expect(
        service.createTransaction(mockCreatePaymentTransaction),
      ).rejects.toThrow(ServiceUnavailableException);
    });
  });
});
