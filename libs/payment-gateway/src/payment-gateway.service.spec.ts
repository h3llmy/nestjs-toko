import { TestBed } from '@automock/jest';
import { PaymentGatewayService } from './payment-gateway.service';
import { CreatePaymentTransaction } from './dto/create-payment-transaction.dto';
import midtrans from 'midtrans-client';
import { ServiceUnavailableException } from '@nestjs/common';
import {
  FraudStatus,
  PaymentCheckDto,
  TransactionStatus,
} from './dto/payment-check.dto';

jest.mock('midtrans-client');

describe('PaymentGatewayService', () => {
  let service: PaymentGatewayService;
  let midtransClientMock: jest.Mocked<midtrans.Snap>;
  let transactionMock: jest.Mocked<midtrans.Transaction>;

  const mockPaymentCheck: PaymentCheckDto = {
    transaction_time: '2023-11-15 18:45:13',
    transaction_status: TransactionStatus.SETTLEMENT,
    transaction_id: '513f1f01-c9da-474c-9fc9-d5c64364b709',
    status_message: 'midtrans payment notification',
    status_code: '200',
    signature_key:
      '82b089b95efa3de41d3a456b9b47b76086891bd2aa1e3806f1a07fb8616f15d33e3841644f17697c8587433fa59f1becd750d88254c81183c41d9cbb30711772',
    settlement_time: '2023-11-15 22:45:13',
    payment_type: 'gopay',
    order_id:
      'payment_notif_test_G444672650_94e56a15-53c5-400a-a395-c635dab21b0e',
    merchant_id: 'G444672650',
    gross_amount: '105000.00',
    fraud_status: FraudStatus.ACCEPT,
    currency: 'IDR',
  };

  beforeEach(() => {
    transactionMock = {
      notification: jest.fn(),
      status: jest.fn(),
      statusb2b: jest.fn(),
      approve: jest.fn(),
      deny: jest.fn(),
      cancel: jest.fn(),
      expire: jest.fn(),
      refund: jest.fn(),
      refundDirect: jest.fn(),
    } as unknown as jest.Mocked<midtrans.Transaction>;

    midtransClientMock = {
      createTransaction: jest.fn(),
      transaction: transactionMock,
    } as unknown as jest.Mocked<midtrans.Snap>;

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

    it('should throw a ServiceUnavailableException if transaction creation fails', async () => {
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

    it('should throw a ServiceUnavailableException if transaction creation returns null', async () => {
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

  describe('paymentCheck', () => {
    it('should check payment status', async () => {
      transactionMock.notification.mockResolvedValue(mockPaymentCheck);

      const result = await service.paymentCheck(mockPaymentCheck);

      expect(result).toBeDefined();
      expect(result.transaction_status).toBe('settlement');
      expect(transactionMock.notification).toHaveBeenCalledWith(
        mockPaymentCheck,
      );
    });

    it('should throw a ServiceUnavailableException if an error occurs during status check', async () => {
      transactionMock.notification.mockRejectedValue(new Error());

      await expect(service.paymentCheck(mockPaymentCheck)).rejects.toThrow(
        ServiceUnavailableException,
      );
    });
  });
});
