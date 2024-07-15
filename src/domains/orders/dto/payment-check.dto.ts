import { IsNotEmpty, IsString } from 'class-validator';

export class paymentCheckDto {
  @IsNotEmpty()
  @IsString()
  transaction_id: string;
}
