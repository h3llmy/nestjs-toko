import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentCheckDto {
  @IsNotEmpty()
  @IsString()
  transaction_id: string;
}
