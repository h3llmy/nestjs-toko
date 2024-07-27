import { IsDateString, IsEnum, IsString } from 'class-validator';

export enum TransactionStatus {
  SETTLEMENT = 'settlement',
  PENDING = 'pending',
  FAILURE = 'failure',
  REFUND = 'refund',
  CANCEL = 'cancel',
}

export enum FraudStatus {
  ACCEPT = 'accept',
  CHALLENGE = 'challenge',
  DENY = 'deny',
}

export class PaymentCheckDto {
  @IsDateString()
  transaction_time: string;

  @IsEnum(TransactionStatus)
  transaction_status: TransactionStatus;

  @IsString()
  transaction_id: string;

  @IsString()
  status_message: string;

  @IsString()
  status_code: string;

  @IsString()
  signature_key: string;

  @IsDateString()
  settlement_time: string;

  @IsString()
  payment_type: string;

  @IsString()
  order_id: string;

  @IsString()
  merchant_id: string;

  @IsString()
  gross_amount: string;

  @IsEnum(FraudStatus)
  fraud_status: FraudStatus;

  @IsString()
  currency: string;
}
