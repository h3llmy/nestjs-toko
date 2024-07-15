import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PaymentTransactionDetails {
  @IsString()
  @IsNotEmpty()
  order_id: string;

  @IsNumber()
  @IsNotEmpty()
  gross_amount: number;
}

export class PaymentItemDetails {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  category: string;
}

export class CreatePaymentTransaction {
  @ValidateNested()
  @Type(() => PaymentTransactionDetails)
  transaction_details: PaymentTransactionDetails;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentItemDetails)
  item_details: PaymentItemDetails[];
}
