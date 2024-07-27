import {
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import midtrans from 'midtrans-client';
import { CreatePaymentTransaction } from './dto/create-payment-transaction.dto';
import { PaymentOrderResponseDto } from './dto/payment-order-response.dto';
import { PaymentCheckDto } from './dto/payment-check.dto';
import { PAYMENT_GATEWAY_OPTIONS } from './payment-gateway.constant';

@Injectable()
export class PaymentGatewayService {
  private client: midtrans.Snap;

  /**
   * Constructs a new instance of the class.
   *
   * @param {midtrans.SnapOptions} options - The options for the Midtrans Snap client.
   */
  constructor(
    @Inject(PAYMENT_GATEWAY_OPTIONS)
    private readonly options: midtrans.SnapOptions,
  ) {
    this.client = new midtrans.Snap(options);
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
      throw new ServiceUnavailableException('payment error');
    }
  }

  /**
   * A description of the entire function.
   *
   * @param {PaymentCheckDto} payload - description of the payload parameter
   * @return {Promise<any>} A promise that resolves to the transaction status
   */
  async paymentCheck(payload: PaymentCheckDto): Promise<PaymentCheckDto> {
    try {
      return await this.client.transaction.notification(payload);
    } catch (error) {
      throw new ServiceUnavailableException('payment error');
    }
  }
}
