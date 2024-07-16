import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import midtrans from 'midtrans-client';
import { CreatePaymentTransaction } from './dto/create-payment-transaction.dto';
import { PaymentOrderResponseDto } from './dto/payment-order-response.dto';
import { PaymentCheckDto } from './dto/payment-check.dto';

@Injectable()
export class PaymentGatewayService {
  private client: midtrans.Snap;

  /**
   * Initializes a new instance of the PaymentGatewayService class.
   *
   * @param {ConfigService} configService - The configuration service used to retrieve environment variables.
   */
  constructor(private readonly configService: ConfigService) {
    this.client = new midtrans.Snap({
      isProduction:
        this.configService.getOrThrow<string>('NODE_ENV', 'development') ===
        'production',
      serverKey: this.configService.getOrThrow<string>('MIDTRANS_SERVER_KEY'),
      clientKey: this.configService.getOrThrow<string>('MIDTRANS_CLIENT_KEY'),
    });
  }

  /**
   * Asynchronously creates a payment transaction using the provided payload.
   *
   * @param {CreatePaymentTransaction} payload - The payload containing the transaction details.
   * @return {Promise<PaymentOrderResponseDto>} A promise that resolves to the created transaction response.
   * @throws {InternalServerErrorException} If the transaction creation fails.
   * @throws {BadRequestException} If an error occurs during the transaction creation process.
   */
  async createTransaction(
    payload: CreatePaymentTransaction,
  ): Promise<PaymentOrderResponseDto> {
    try {
      const transaction = await this.client.createTransaction(payload);
      if (!transaction) {
        throw new ServiceUnavailableException('Failed to create transaction');
      }
      return transaction;
    } catch (error) {
      console.log(error);

      throw new ServiceUnavailableException('payment error');
    }
  }

  /**
   * A description of the entire function.
   *
   * @param {PaymentCheckDto} payload - description of the payload parameter
   * @return {Promise<any>} A promise that resolves to the transaction status
   */
  async paymentCheck(payload: PaymentCheckDto): Promise<any> {
    try {
      const transactionStatus =
        await this.client.transaction.notification(payload);
      if (!transactionStatus) {
        throw new NotFoundException('transaction not found status');
      }
      return transactionStatus;
    } catch (error) {
      throw new ServiceUnavailableException('payment error');
    }
  }
}