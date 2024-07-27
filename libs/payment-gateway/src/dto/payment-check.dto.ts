import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsString } from 'class-validator';

export enum TransactionStatus {
  SETTLEMENT = 'settlement',
  PENDING = 'pending',
  FAILURE = 'failure',
  REFUND = 'refund',
  CANCEL = 'cancel',
  CAPTURE = 'capture',
  EXPIRE = 'expire',
  DENY = 'deny',
  PARTIAL_CHARGEBACK = 'partial_chargeback',
  CHARGEBACK = 'chargeback',
  PARTIAL_REFUND = 'partial_refund',
}

export enum FraudStatus {
  ACCEPT = 'accept',
  CHALLENGE = 'challenge',
  DENY = 'deny',
}

export class PaymentCheckDto {
  @ApiProperty({
    description: 'Transaction time',
    example: '2020-01-01',
  })
  @IsDateString()
  transaction_time: string;

  @ApiProperty({
    description: 'Transaction status',
    example: TransactionStatus.SETTLEMENT,
  })
  @IsEnum(TransactionStatus)
  transaction_status: TransactionStatus;

  @ApiProperty({
    description: 'Transaction id',
    example: '513f1f01-c9da-474c-9fc9-d5c64364b709',
  })
  @IsString()
  transaction_id: string;

  @ApiProperty({
    description: 'Status message',
    example: 'midtrans payment notification',
  })
  @IsString()
  status_message: string;

  @ApiProperty({
    description: 'Status code',
    example: '200',
  })
  @IsString()
  status_code: string;

  @ApiProperty({
    description: 'Signature key',
    example: 'signature_key',
  })
  @IsString()
  signature_key: string;

  @ApiProperty({
    description: 'Settlement time',
    example: '2020-01-01',
  })
  @IsDateString()
  settlement_time: string;

  @ApiProperty({
    description: 'Payment type',
    example: 'gopay',
  })
  @IsString()
  payment_type: string;

  @ApiProperty({
    description: 'Order id',
    example: '513f1f01-c9da-474c-9fc9-d5c64364b709',
  })
  @IsString()
  order_id: string;

  @ApiProperty({
    description: 'Merchant id',
    example: 'G444672650',
  })
  @IsString()
  merchant_id: string;

  @ApiProperty({
    description: 'Gross amount',
    example: '105000.00',
  })
  @IsString()
  gross_amount: string;

  @ApiProperty({
    description: 'Fraud status',
    example: FraudStatus.ACCEPT,
  })
  @IsEnum(FraudStatus)
  fraud_status: FraudStatus;

  @ApiProperty({
    description: 'Currency',
    example: 'IDR',
  })
  @IsString()
  currency: string;
}
