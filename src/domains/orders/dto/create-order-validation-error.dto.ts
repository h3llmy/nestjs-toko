import { ApiProperty } from '@nestjs/swagger';

class OrderValidationErrorDto {
  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  productId: string[];

  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  quantity: string[];

  @ApiProperty({
    type: 'string',
    isArray: true,
  })
  discountId: string[];
}

export class CreateOrderValidationErrorDto {
  @ApiProperty({ type: OrderValidationErrorDto })
  'orders.0': OrderValidationErrorDto;
}
