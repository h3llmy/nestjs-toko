import { ApiProperty } from '@nestjs/swagger';

export class OrderNotificationValidationErrorDto {
  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  transaction_time: string[];

  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  transaction_status: string[];

  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  transaction_id: string[];

  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  status_message: string[];

  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  status_code: string[];

  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  signature_key: string[];

  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  settlement_time: string[];

  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  payment_type: string[];

  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  order_id: string[];

  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  merchant_id: string[];

  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  gross_amount: string[];

  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  fraud_status: string[];

  @ApiProperty({
    isArray: true,
    type: 'string',
  })
  currency: string[];
}
