import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

enum TransactionStatus {
  Settlement = 'settlement',
  Pending = 'pending',
  Failure = 'failure',
  Refund = 'refund',
  Cancel = 'cancel',
}

enum FraudStatus {
  Accept = 'accept',
  Challenge = 'challenge',
  Deny = 'deny',
}

class VANumber {
  @IsNumberString()
  va_number: string;

  @IsString()
  bank: string;
}

class PaymentAmount {
  // Define properties if needed in the future
}

export class PaymentCheckDto {
  @ValidateNested({ each: true })
  @IsArray()
  @ValidateNested({ each: true })
  va_numbers: VANumber[];

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

  @IsOptional()
  @ValidateNested({ each: true })
  @IsArray()
  payment_amounts?: PaymentAmount[];

  @IsString()
  order_id: string;

  @IsString()
  merchant_id: string;

  @IsString()
  gross_amount: string;

  @IsEnum(FraudStatus)
  fraud_status: FraudStatus;

  @IsDateString()
  expiry_time: string;

  @IsString()
  currency: string;
}
