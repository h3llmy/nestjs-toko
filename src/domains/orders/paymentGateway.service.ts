import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import midtrans from 'midtrans-client';
import { CreatePaymentTransaction } from './dto/create-payment-transaction.dto';
import { paymentCheckDto } from './dto/payment-check.dto';
import { PaymentOrderResponseDto } from './dto/payment-order-response.dto';

@Injectable()
export class PaymentGatewayService {
  private client: midtrans.Snap;

  constructor(private readonly configService: ConfigService) {
    this.client = new midtrans.Snap({
      isProduction:
        this.configService.get<string>('NODE_ENV', 'development') ===
        'production',
      serverKey: this.configService.get<string>('MIDTRANS_SERVER_KEY'),
      clientKey: this.configService.get<string>('MIDTRANS_CLIENT_KEY'),
    });
  }

  async createTransaction(
    payload: CreatePaymentTransaction,
  ): Promise<PaymentOrderResponseDto> {
    try {
      const transaction = await this.client.createTransaction(payload);
      if (!transaction) {
        throw new InternalServerErrorException('Failed to create transaction');
      }
      return transaction;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async paymentCheck(payload: paymentCheckDto): Promise<any> {
    try {
      const transactionStatus =
        await this.client.transaction.notification(payload);
      if (!transactionStatus) {
        throw new NotFoundException('transaction not found status');
      }
      return transactionStatus;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
